import { Icon, LucideIcons } from "@/components/Icons";
import { getFriendsByUserId } from "@/helpers/getFriendsByUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import FriendsRequestSideBarOption from "./FriendsRequestSideBarOption";
import SideBarChatsList from "./SideBarChatsList";
import SignOutButton from "./SignOutButton";
import Avatar from "./ui/Avatar";
import { notFound } from "next/navigation";

interface SideBarOptions {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sideBarOptions: SideBarOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const SideBar = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const { user } = session;

  const unseenRequestsCount = (
    (await fetchRedis(
      "smembers",
      `user:${user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  const friends = await getFriendsByUserId(user.id);


  return (
    <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 border-r border-gray-200 bg-blue-light px-3 text-white">
      <Link
        className="flex relative shrink-0 items-center pt-4"
        href="/dashboard"
      >
        <Image
          quality={100}
          width={250}
          height={220}
          src="/connectify.png"
          alt="connectify"
        />
      </Link>
      <span className="leading-6 text-slate-200 font-semibold">Overview</span>

      <ul role="list" className="flex flex-col gap-y-1">
        {sideBarOptions.map(option => {
          const Icon = LucideIcons[option.Icon];
          return (
            <li key={option.id}>
              <Link
                href={option.href}
                className="flex items-center bg-gray-100 hover:bg-gray-200 p-3 rounded-md gap-x-2 cursor-pointer "
              >
                <Icon className="text-blue-light h-7 w-7 border-solid border rounded-md  border-blue-light" />
                <span className="text-gray-800 font-semibold">
                  {option.name}
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <FriendsRequestSideBarOption
            sessionId={user.id}
            initialUnseenRequestsCount={unseenRequestsCount}
          />
        </li>
      </ul>

      {friends.length > 0 ? (
        <span className="leading-6 text-slate-200 font-semibold">
          Your Chats
        </span>
      ) : null}

      <nav className="flex flex-col overflow-hidden flex-grow -mr-3">
        <SideBarChatsList sessionId={user.id} friends={friends} />
      </nav>

      <div className="flex items-center bg-gray-100 -mx-2 justify-between px-2 py-3  rounded-sm rounded-t-xl">
        <div className="flex items-center gap-x-3">
          <Avatar src={user.image || ""} alt={user.name || ""} />

          <div className="flex flex-col gap-y-1 ">
            <span className="text-gray-800 ">{user.name}</span>
            <span className="text-zinc-400 text-xs">{user.email} </span>
          </div>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default SideBar;
