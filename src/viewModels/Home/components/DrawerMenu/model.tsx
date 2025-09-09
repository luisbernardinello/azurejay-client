import { Alert } from 'react-native';
import { Conversation } from '../../../../shared/interfaces/conversation.interface';
import { useDeleteConversation } from '../../../../shared/services/conversation.service';

export const useDrawerMenuModel = (
  conversations: Conversation[],
  onConversationPress: (id: string) => void,
  onNewConversation: () => void,
  currentConversationId?: string
) => {
  const deleteConversation = useDeleteConversation();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleDeleteConversation = (conversationId: string, title: string) => {
    Alert.alert(
      'Excluir conversa',
      `Tem certeza que deseja excluir "${title}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteConversation.mutate(conversationId),
        },
      ]
    );
  };

  const getConversationStats = () => {
    return {
      total: conversations.length,
      hasActive: !!currentConversationId,
    };
  };

  const isCurrentConversation = (conversationId: string): boolean => {
    return conversationId === currentConversationId;
  };

  return {
    formatDate,
    handleDeleteConversation,
    getConversationStats,
    isCurrentConversation,
    isDeleting: deleteConversation.isPending,
    deleteError: deleteConversation.error,
  };
};