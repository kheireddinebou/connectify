import Avatar from "@/components/ui/Avatar";
import { getFriendsByUserId } from "@/helpers/getFriendsByUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { generateChatId } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { user } = session;

  const friends = await getFriendsByUserId(user.id);

  const friendsWithLastMessage = await Promise.all(
    friends.map(async friend => {
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${generateChatId(friend.id, user.id)}:messages`,
        -1,
        -1
      )) as string[];

      const lastMessage = JSON.parse(lastMessageRaw) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <div className="py-10 px-3 md:px-10 w-full">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-zinc-500">Nothing to show here...</p>
      ) : (
        <div className="flex flex-col w-full gap-2">
          {friendsWithLastMessage.map(friend => (
            <Link
              href={`/dashboard/chat/${generateChatId(friend.id, user.id)}`}
              key={friend.id}
              className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-all w-full lg:w-[80%] p-3 rounded-md border border-zinc-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar src={friend.image} alt={friend.name} size={35} />
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">{friend.name}</span>
                  <span className="text-md max-w-[100px] md:max-w-[300px] truncate">
                    {friend.lastMessage.senderId === user.id ? (
                      <span className="text-zinc-500">You: </span>
                    ) : (
                      ""
                    )}
                    {friend.lastMessage.text}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-zinc-600 w-8 h-8" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
