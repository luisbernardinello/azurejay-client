import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeleteConversation } from '../../shared/services/conversation.service';
import { Colors, getThemeColors } from '../../shared/utils/colors';
import { MessageItemView } from './components/MessageItem/view';
import { useTranscriptionModel } from './model';

interface TranscriptionViewProps {
  conversationId: string;
  onClose: () => void;
  onBackToChat: () => void;
}

export function TranscriptionView({
  conversationId,
  onClose,
  onBackToChat,
}: TranscriptionViewProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const {
    conversation,
    isLoading,
    error,
    getMessageStats,
  } = useTranscriptionModel(conversationId, onClose, onBackToChat);

  // delete conversation hooks
  const deleteConversation = useDeleteConversation();

  const handleDeleteConversation = () => {
    if (!conversation) return;

    Alert.alert(
      'Excluir conversa',
      `Tem certeza que deseja excluir "${conversation.title}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteConversation.mutate(conversationId, {
              onSuccess: () => {
                onClose();
              },
              onError: () => {
                Alert.alert('Erro', 'Não foi possível excluir a conversa.');
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View 
        className="flex-1 items-center justify-center px-10" 
        style={{ 
          paddingTop: insets.top,
          backgroundColor: themeColors.background 
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary[500]} />
        <Text 
          className="text-base mt-4"
          style={{ color: themeColors.text.secondary }}
        >
          Carregando transcrição...
        </Text>
      </View>
    );
  }

  if (error || !conversation) {
    return (
      <View 
        className="flex-1 items-center justify-center px-10" 
        style={{ 
          paddingTop: insets.top,
          backgroundColor: themeColors.background 
        }}
      >
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error[500]} />
        <Text 
          className="text-base text-center mt-4 mb-6"
          style={{ color: Colors.error[500] }}
        >
          {typeof error === 'string'
            ? error
            : error instanceof Error
            ? error.message
            : 'Não foi possível carregar a conversa'}
        </Text>
        <TouchableOpacity 
          className="px-5 py-3 rounded-lg"
          style={{ backgroundColor: `${Colors.primary[500]}20` }}
          onPress={onClose}
        >
          <Text 
            className="font-medium"
            style={{ color: Colors.primary[500] }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stats = getMessageStats();

  return (
    <View 
      className="flex-1" 
      style={{ 
        paddingTop: insets.top,
        backgroundColor: themeColors.background 
      }}
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-5 py-4 border-b"
        style={{
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border,
        }}
      >
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={themeColors.text.primary} 
          />
        </TouchableOpacity>
        
        <View className="flex-1 items-center px-4">
          <Text 
            className="text-lg font-bold"
            style={{ color: themeColors.text.primary }}
          >
            Transcrição
          </Text>
          <Text 
            className="text-sm" 
            numberOfLines={1}
            style={{ color: themeColors.text.secondary }}
          >
            {conversation.title}
          </Text>
        </View>
        
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          onPress={handleDeleteConversation}
          activeOpacity={0.7}
          disabled={deleteConversation.isPending}
        >
          <Ionicons 
            name="trash-outline" 
            size={24} 
            color={deleteConversation.isPending ? themeColors.text.tertiary : Colors.error[500]} 
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {conversation.messages && conversation.messages.length > 0 ? (
          <>
            {conversation.messages.map((message, index) => (
              <MessageItemView 
                key={index} 
                message={message} 
                messageIndex={index}
              />
            ))}
            
            {/* Basic Stats */}
            <View 
              className="flex-row justify-around mt-5 mx-5 p-4 rounded-xl"
              style={{ backgroundColor: themeColors.surface }}
            >
              <View className="flex-row items-center">
                <Ionicons name="chatbubbles-outline" size={20} color={Colors.primary[500]} />
                <Text 
                  className="text-sm ml-2 font-medium"
                  style={{ color: themeColors.text.secondary }}
                >
                  {stats.total} mensagens
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="school-outline" size={20} color={Colors.secondary[500]} />
                <Text 
                  className="text-sm ml-2 font-medium"
                  style={{ color: themeColors.text.secondary }}
                >
                  {stats.corrections} correções
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-15">
            <Ionicons 
              name="chatbubbles-outline" 
              size={48} 
              color={themeColors.text.tertiary} 
            />
            <Text 
              className="text-base mt-4"
              style={{ color: themeColors.text.secondary }}
            >
              Nenhuma mensagem nesta conversa
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View 
        className="px-5 py-4 border-t"
        style={{
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
        }}
      >
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-xl"
          style={{ backgroundColor: Colors.primary[500] }}
          onPress={onBackToChat}
          activeOpacity={0.7}
        >
          <Ionicons name="mic" size={20} color="#ffffff" />
          <Text className="text-white text-base font-semibold ml-2">
            Continuar Conversa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}