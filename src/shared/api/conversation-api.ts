import { Conversation, ConversationDetail } from '../interfaces/conversation.interface';
import { coreApi } from './core-api';

export class ConversationApi {
  async getConversations(): Promise<Conversation[]> {
    return await coreApi.get<Conversation[]>('/conversations/');
  }

  async getConversationDetail(conversationId: string): Promise<ConversationDetail> {
    return await coreApi.get<ConversationDetail>(`/conversations/${conversationId}`);
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await coreApi.delete(`/conversations/${conversationId}`);
  }
}

export const conversationApi = new ConversationApi();