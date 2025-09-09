import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '../api/conversation-api';
import { QUERY_KEYS } from '../utils/constants';
import { conversationAudioService } from './conversationAudio.service';

export const useConversations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS,
    queryFn: () => conversationApi.getConversations(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useConversationDetail = (conversationId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.CONVERSATION_DETAIL(conversationId || ''),
    queryFn: () => conversationApi.getConversationDetail(conversationId!),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await conversationApi.deleteConversation(conversationId);
      
      await conversationAudioService.removeConversationAudio(conversationId);
      
      return conversationId;
    },
    onSuccess: (deletedConversationId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS });
      
      queryClient.removeQueries({ 
        queryKey: QUERY_KEYS.CONVERSATION_DETAIL(deletedConversationId) 
      });
      
    },
    onError: (error, conversationId) => {
      console.error(`Failed to delete conversation ${conversationId}:`, error);
    }
  });
};