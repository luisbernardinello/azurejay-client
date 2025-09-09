import { useState } from 'react';
import { useConversationDetail } from '../../shared/services/conversation.service';

export const useTranscriptionModel = (
  conversationId: string,
  onClose: () => void,
  onBackToChat: () => void
) => {
  const { data: conversation, isLoading, error, refetch } = useConversationDetail(conversationId);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const getMessageStats = () => {
    if (!conversation?.messages) return { total: 0, corrections: 0 };
    
    return {
      total: conversation.messages.length,
      corrections: conversation.messages.filter(m => m.analysis?.improvement).length,
    };
  };

  return {
    conversation,
    isLoading,
    error,
    shareModalVisible,
    setShareModalVisible,
    getMessageStats,
    refreshConversation: refetch,
  };
};