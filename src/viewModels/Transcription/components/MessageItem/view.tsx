import { Ionicons } from '@expo/vector-icons';
import { Text, useColorScheme, View } from 'react-native';
import { Message } from '../../../../shared/interfaces/conversation.interface';
import { getThemeColors } from '../../../../shared/utils/colors';
import { useMessageItemModel } from './model';

interface MessageItemViewProps {
  message: Message;
  messageIndex?: number;
}

export function MessageItemView({ message, messageIndex }: MessageItemViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const {
    isHuman,
    isAI,
    hasAnalysis,
    getMessageIcon,
    getMessageColor,
    getMessageBackgroundColor,
    getSenderName,
    getAnalysisColor,
    getAnalysisBackgroundColor,
  } = useMessageItemModel({ message, messageIndex });
  
  return (
    <View className="mb-6 px-5">
      {/* Message Header */}
      <View className="flex-row items-center mb-2">
        <View 
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: getMessageColor() }}
        >
          <Ionicons
            name={getMessageIcon() as any}
            size={16}
            color="#ffffff"
          />
        </View>
        <Text 
          className="text-sm font-semibold ml-2"
          style={{ color: themeColors.text.primary }}
        >
          {getSenderName()}
        </Text>
        
        {/* Subtle analysis indicator */}
        {hasAnalysis && (
          <View className="ml-auto">
            <View 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: getAnalysisColor() }}
            />
          </View>
        )}
      </View>

      {/* Message Content */}
      <View className="ml-9">
        <View 
          className={`p-4 rounded-xl ${isHuman ? 'rounded-br-sm' : isAI ? 'rounded-bl-sm' : 'rounded-xl'}`}
          style={{ backgroundColor: getMessageBackgroundColor() }}
        >
          <Text 
            className="text-base leading-6"
            style={{ color: themeColors.text.primary }}
          >
            {message.content}
          </Text>
        </View>

        {message.analysis?.improvement && (
          <View className="mt-2">
            {/* Connecting line */}
            <View 
              className="w-0.5 h-3 ml-4"
              style={{ backgroundColor: `${getAnalysisColor()}30` }}
            />
            
            {/* Compact suggestion card */}
            <View 
              className="rounded-lg border-l-2 pl-3 pr-4 py-3"
              style={{
                backgroundColor: `${getAnalysisColor()}08`,
                borderLeftColor: getAnalysisColor(),
              }}
            >
              {/* Compact header */}
              <View className="flex-row items-center mb-2">
                <View 
                  className="w-5 h-5 rounded-full items-center justify-center mr-2"
                  style={{ backgroundColor: getAnalysisColor() }}
                >
                  <Ionicons 
                    name="bulb" 
                    size={12} 
                    color="#ffffff" 
                  />
                </View>
                <Text 
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: getAnalysisColor() }}
                >
                  Sugestão
                </Text>
              </View>
              
              {/* Improvement text */}
              <Text 
                className="text-sm leading-5"
                style={{ 
                  color: themeColors.text.primary,
                  fontStyle: 'italic'
                }}
              >
                {message.analysis.improvement}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}