import ChatInput from "@/components/ChatInput";
import ChatTopBar from "@/components/ChatTopBar";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validators/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map(message => JSON.parse(message) as Message);

    const messages = messageArrayValidator.parse(dbMessages);
    return messages;
  } catch (error) {
    return notFound();
  }
};

const page = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  const { user } = session;

  const { chatId } = params;

  const [userId1, userId2] = chatId.split("--");

  if (userId1 !== user.id && userId2 !== user.id) {
    return notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex h-full flex-col items-center md:px-8 xl:px-14 w-full">
      <ChatTopBar chatPartner={chatPartner} />
      <Messages
        chatId={chatId}
        session={session}
        chatPartner={chatPartner}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
