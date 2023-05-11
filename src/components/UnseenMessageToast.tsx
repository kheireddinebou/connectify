import { cn, generateChatId } from "@/lib/utils";
import { FC } from "react";
import { toast, type Toast } from "react-hot-toast";
import Avatar from "./ui/Avatar";

interface UnseenMessageToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  senderMessage: string;
}

const UnseenMessageToast: FC<UnseenMessageToastProps> = ({
  t,
  sessionId,
  senderId,
  senderName,
  senderImage,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        "max-w-md bg-white w-full mx-2 rounded-lg pointer-events-auto flex ring ring-black ring-opacity-5",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        href={`/dashboard/chat/${generateChatId(sessionId, senderId)}`}
        onClick={() => toast.dismiss(t.id)}
        className="flex items-center gap-2 flex-grow p-3 border-r border-zinc-300"
      >
        <Avatar alt={senderName} src={senderImage} />
        <div className="flex flex-col">
          <span className="font-medium">{senderName}</span>
          <span className="text-zinc-400 text-md truncate inline-block max-w-[250px]">{senderMessage}</span>
        </div>
      </a>
      <button
        onClick={() => toast.dismiss()}
        className="text-blue-light font-medium p-4 hover:bg-blue-50 transition-all"
      >
        Close
      </button>
    </div>
  );
};

export default UnseenMessageToast;
