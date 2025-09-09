export interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

export interface Message {
  role: 'human' | 'ai';
  content: string;
  analysis?: {
    improvement?: string;
    [key: string]: any;
  } | null;
}

export interface ConversationDetail {
  id: string;
  title: string;
  messages: Message[];
}

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: ConversationDetail | null;
  loading: boolean;
  error: string | null;
}