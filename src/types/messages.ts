export interface ChatMessage {
  id: string;
  sender: 'user' | 'seller' | 'system';
  text: string;
  time: string;
  date: string;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'offer' | 'location' | 'system';
  offerPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined';
  imageUrl?: string;
  locationName?: string;
}

export interface ChatAdInfo {
  id: number;
  title: string;
  price: string | number;
  image: string;
  address?: string;
  status?: 'active' | 'closed' | 'reserved';
}

export interface ChatDialog {
  id: string;
  sellerId: number;
  sellerName: string;
  sellerAvatar?: string | null;
  sellerPhone?: string;
  sellerOnline: boolean;
  sellerLastSeen?: string;
  sellerRating?: number;
  isVerified?: boolean;
  type: 'buying' | 'selling';
  ad: ChatAdInfo;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageTime: string;
  lastMessageText: string;
  isPinned?: boolean;
}

export interface MessagesState {
  dialogs: ChatDialog[];
  activeChatId: string | null;
  filterTab: 'all' | 'buying' | 'selling' | 'unread';
  searchQuery: string;
}
