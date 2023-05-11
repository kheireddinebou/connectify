"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FriendsRequestSideBarOptionProps {
  initialUnseenRequestsCount: number;
  sessionId: string;
}

const FriendsRequestSideBarOption = ({
  initialUnseenRequestsCount,
  sessionId,
}: FriendsRequestSideBarOptionProps) => {
  const [unseenRequestsCount, setUnseenRequestsCount] = useState(
    initialUnseenRequestsCount
  );

  const friendRequestHandler = () => {
    setUnseenRequestsCount(prev => prev + 1);
  };

  useEffect(() => {
    const pusherKey = toPusherKey(`user:${sessionId}:incoming_friend_requests`);
    pusherClient.subscribe(pusherKey);
    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href="/dashboard/requests"
      className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md gap-x-2  cursor-pointer "
    >
      <User className="text-blue-light h-7 w-7 border-solid border rounded-md  border-blue-light" />
      <span className="text-gray-800 font-semibold">Friend requests</span>
      {unseenRequestsCount > 0 ? (
        <div className="rounded-full w-5 h-5 text-white text-sm bg-blue-light flex items-center justify-center">
          {unseenRequestsCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendsRequestSideBarOption;
