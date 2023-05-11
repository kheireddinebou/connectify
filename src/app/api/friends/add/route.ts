import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validators/add-friend";
import { getServerSession } from "next-auth";
import z from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized.", { status: 403 });
    }
    const { user } = session;

    if (user.id === idToAdd) {
      return new Response("You cannot add yourself.", { status: 400 });
    }

    const isAlreadyAdd = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      user.id
    )) as 0 | 1;

    if (isAlreadyAdd) {
      return new Response("Already add this user!", { status: 400 });
    }

    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      user.id
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("Already friend!", { status: 400 });
    }

    // valid request => send friend request

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: user.id,
        senderEmail: user.email,
      }
    );

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", {
      status: 500,
    });
  }
};
