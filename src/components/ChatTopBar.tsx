import { FC } from "react";
import Avatar from "./ui/Avatar";

interface ChatTopBarProps {
  chatPartner: User;
}

const ChatTopBar: FC<ChatTopBarProps> = ({ chatPartner }) => {
  return (
    <div className="flex items-center gap-x-3 border-b border-gray-400 p-4 w-full">
      <Avatar src={chatPartner.image} alt={chatPartner.name} />

      <div className="flex flex-col">
        <span className="text-gray-800 font-medium text-lg">{chatPartner.name}</span>
        <span className="text-zinc-500 text-sm">{chatPartner.email} </span>
      </div>
    </div>
  );
};

export default ChatTopBar;
