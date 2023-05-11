"use client";

import { generateChatId, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Avatar from "./ui/Avatar";
import { pusherClient } from "@/lib/pusher";
import { toast } from "react-hot-toast";
import UnseenMessageToast from "./UnseenMessageToast";

interface SideBarChatsListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImage: string;
  senderName: string;
}

const SideBarChatsList: FC<SideBarChatsListProps> = ({
  friends,
  sessionId,
}) => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${generateChatId(sessionId, message.senderId)}`;
      if (!shouldNotify) return;

      toast.custom(t => (
        <UnseenMessageToast
          sessionId={sessionId}
          senderId={message.senderId}
          senderName={message.senderName}
          senderImage={message.senderImage}
          senderMessage={message.text}
          t={t}
        />
      ));

      setUnseenMessages(prev => [...prev, message]);
    };

    const newFriendHandler = (friend: User) => {
      setActiveChats(prev => [friend, ...prev]);
    };

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages(prev =>
        prev.filter(msg => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);

  return (
    <ul
      role="list"
      className="flex flex-col gap-y-1 max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300"
    >
      {activeChats.map(friend => {
        const unseenMessagesCount = unseenMessages.filter(
          msg => msg.senderId === friend.id
        ).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${generateChatId(sessionId, friend.id)}`}
              className="flex items-center mr-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-md gap-x-2  cursor-pointer "
            >
              <Avatar src={friend.image} alt={friend.name} />

              <span className="text-gray-800 font-semibold">{friend.name}</span>
              {unseenMessagesCount > 0 ? (
                <div className="rounded-full w-5 h-5 text-white font-medium text-sm bg-blue-light flex items-center justify-center ml-auto">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatsList;
