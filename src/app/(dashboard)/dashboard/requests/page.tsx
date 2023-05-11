import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  const { user } = session;

  const friendRequestsIds = (await fetchRedis(
    "smembers",
    `user:${user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    friendRequestsIds.map(async senderId => {
      const res = (await fetchRedis("get", `user:${senderId}`)) as string;
      const sender = JSON.parse(res) as User;
      return {
        senderId,
        senderEmail: sender.email,
      };
    })
  );

  return (
    <section className="pt-8 px-3">
      <h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
      <FriendRequests
        incomingFriendRequests={incomingFriendRequests}
        sessionId={user.id}
      />
    </section>
  );
};

export default page;
