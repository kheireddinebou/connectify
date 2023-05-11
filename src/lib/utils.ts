import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateChatId(user1Id: string, user2Id: string) {
  const sortedUserIds = [user1Id, user2Id].sort();
  const chatId = sortedUserIds.join("--");

  return chatId;
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__');
}
