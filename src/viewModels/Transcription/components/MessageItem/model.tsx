import { Message } from '../../../../shared/interfaces/conversation.interface';
import { Colors } from '../../../../shared/utils/colors';

interface MessageItemModelProps {
  message: Message;
  messageIndex?: number;
}

export const useMessageItemModel = ({ message, messageIndex }: MessageItemModelProps) => {
  const isHuman = message.role === 'human';
  const isAI = message.role === 'ai';
  const hasAnalysis = !!message.analysis?.improvement;

  const getMessageIcon = () => {
    return isHuman ? 'person' : 'chatbubble';
  };

  const getMessageColor = () => {
    return isHuman ? Colors.primary[500] : Colors.secondary[500];
  };

  const getMessageBackgroundColor = () => {
    return isHuman ? `${Colors.primary[500]}10` : `${Colors.secondary[500]}10`;
  };

  const getSenderName = () => {
    return isHuman ? 'Você' : 'Rachel AI';
  };

  const getAnalysisColor = () => {
    return Colors.warning[500];
  };

  const getAnalysisBackgroundColor = () => {
    return `${Colors.warning[500]}10`;
  };

  return {
    isHuman,
    isAI,
    hasAnalysis,
    getMessageIcon,
    getMessageColor,
    getMessageBackgroundColor,
    getSenderName,
    getAnalysisColor,
    getAnalysisBackgroundColor,
    messageIndex: messageIndex || 0,
  };
};