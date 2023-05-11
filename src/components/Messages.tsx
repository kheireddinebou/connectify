"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import Avatar from "./ui/Avatar";
import { type Session } from "next-auth";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  chatPartner: User;
  session: Session;
  chatId: string;
}

const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};

const Messages: FC<MessagesProps> = ({
  initialMessages,
  chatPartner,
  session,
  chatId,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const { user } = session;

  const newMessageHandler = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  useEffect(() => {
    const pusherKey = toPusherKey(`chat:${chatId}`);
    pusherClient.subscribe(pusherKey);
    pusherClient.bind("incoming_message", newMessageHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("incoming_message", newMessageHandler);
    };
  }, [chatId]);

  useLayoutEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesRef}
      className="flex flex-col flex-grow w-full p-3 overflow-auto"
    >
      {messages.map((msg, index) => {
        const isCurrentUserMsg = msg.senderId === user.id;
        const hasNextMessage =
          messages[index + 1]?.senderId === messages[index].senderId;
        return (
          <div
            className={cn("flex items-end gap-1 mb-5", {
              "self-end flex-row-reverse ": isCurrentUserMsg,
              "self-start": !isCurrentUserMsg,
              "mb-1": hasNextMessage,
            })}
            key={msg.id}
          >
            <Avatar
              className={`${hasNextMessage ? "invisible" : "visible"}`}
              size={30}
              src={isCurrentUserMsg ? user?.image : chatPartner?.image}
              alt={isCurrentUserMsg ? user?.name : chatPartner?.name}
            />
            <div
              className={cn("px-4 py-2 rounded-lg inline-block", {
                "bg-blue-light text-white": isCurrentUserMsg,
                "bg-gray-200 text-gray-900": !isCurrentUserMsg,
                "rounded-br-none": !hasNextMessage && isCurrentUserMsg,
                "rounded-bl-none": !hasNextMessage && !isCurrentUserMsg,
              })}
            >
              <span className="inline-block text-lg max-w-xs">{msg.text}</span>
              <span
                className={cn("text-xs ml-2", {
                  "text-zinc-200": isCurrentUserMsg,
                  "text-zinc-400": !isCurrentUserMsg,
                })}
              >
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
