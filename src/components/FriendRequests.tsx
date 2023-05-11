"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FriendRequestsProps {
  sessionId: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequests = ({
  sessionId,
  incomingFriendRequests,
}: FriendRequestsProps) => {
  const [friendReuqests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const friendRequestHandler = ({
    senderId,
    senderEmail,
  }: IncomingFriendRequest) => {
    setFriendRequests(prev => [...prev, { senderId, senderEmail }]);
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

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests(friendReuqests.filter(req => req.senderId !== senderId));
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests(friendReuqests.filter(req => req.senderId !== senderId));
  };

  return (
    <>
      {friendReuqests.length === 0 ? (
        <p className="text-zink-400 text-sm">Nothing to show here...</p>
      ) : (
        <div className="flex flex-col gap-y-3">
          {friendReuqests.map(req => (
            <div className="flex gap-x-4 items-center" key={req.senderId}>
              <UserPlus className="text-black" />
              <span className="text-black font-semibold">
                {req.senderEmail}
              </span>
              <button
                onClick={() => acceptFriend(req.senderId)}
                className="rounded-full flex justify-center items-center h-8 w-8 bg-blue-light transition-all hover:bg-blue-800 hover:shadow-md"
              >
                <Check className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => denyFriend(req.senderId)}
                className="rounded-full flex justify-center items-center h-8 w-8 bg-red-600 transition-all hover:bg-red-800 hover:shadow-md"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FriendRequests;
