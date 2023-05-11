interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}

interface Message extends FriendRequest {
  text: string;
  timestamp: number;
}

interface Chat {
  id: string;
  messages: Message[];
}
