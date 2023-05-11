import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendsIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendsIds.map(async friendId => {
      const res = (await fetchRedis("get", `user:${friendId}`)) as string;
      const friend = JSON.parse(res) as User;
      return friend;
    })
  );

  return friends;
};
