"use client";

import { Loader2, Send } from "lucide-react";
import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (inputValue.trim().length > 0) {
      setIsLoading(true);
      try {
        await axios.post("/api/message/send", { text: inputValue, chatId });
      } catch (error) {
        toast.error("Something went wrong. Please try later");
      } finally {
        setInputValue("");
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    } else {
      toast.error("You cannot send an empty message");
    }
  };

  return (
    <form className="flex items-center gap-x-3 border-t border-gray-400 py-2 md:py-4 px-2 w-full">
      <TextareaAutosize
        className="flex-grow resize-none ring-gray-300 border-none ring-2 focus:ring-2 focus:ring-blue-light rounded-md placeholder:text-gray-400"
        ref={textareaRef}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={`Message ${chatPartner.name}`}
      />
      <Button onClick={sendMessage} disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send />}
      </Button>
    </form>
  );
};

export default ChatInput;
