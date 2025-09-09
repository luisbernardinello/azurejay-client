import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Conversation } from '../../../../shared/interfaces/conversation.interface';
import { Colors, getThemeColors } from '../../../../shared/utils/colors';
import { useDrawerMenuModel } from './model';

interface DrawerMenuViewProps {
  conversations: Conversation[];
  conversationsLoading: boolean;
  conversationsError: any;
  handleSelectConversation: (id: string) => void;
  handleNewConversation: () => void;
  audioState: { currentConversationId: string | null };
}

export function DrawerMenuView({
  conversations,
  conversationsLoading,
  conversationsError,
  handleSelectConversation,
  handleNewConversation,
  audioState,
}: DrawerMenuViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const { 
    formatDate, 
    handleDeleteConversation, 
    isCurrentConversation,
    getConversationStats 
  } = useDrawerMenuModel(
    conversations,
    handleSelectConversation,
    handleNewConversation,
    audioState.currentConversationId || undefined
  );

  const stats = getConversationStats();

  function ConversationItem({ item }: { item: Conversation }) {
    const isCurrent = isCurrentConversation(item.id);
    
    return (
      <TouchableOpacity
        className={`flex-row items-center px-5 py-4 border-b ${
          isCurrent ? 'border-r-2' : ''
        }`}
        style={{
          borderBottomColor: themeColors.border,
          borderRightColor: isCurrent ? Colors.primary[500] : 'transparent',
          backgroundColor: isCurrent ? `${Colors.primary[500]}05` : 'transparent',
        }}
        onPress={() => handleSelectConversation(item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-1 mr-3">
          <Text
            className="text-base font-medium mb-1"
            style={{
              color: isCurrent ? Colors.primary[500] : themeColors.text.primary,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            className="text-xs"
            style={{
              color: isCurrent 
                ? `${Colors.primary[500]}CC` 
                : themeColors.text.secondary,
            }}
          >
            {formatDate(item.updated_at)}
          </Text>
        </View>
        <Ionicons
          name="chatbubble-outline"
          size={16}
          color={isCurrent ? Colors.primary[500] : themeColors.text.tertiary}
        />
      </TouchableOpacity>
    );
  }

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-10">
      <Ionicons 
        name="chatbubbles-outline" 
        size={48} 
        color={themeColors.text.tertiary} 
      />
      <Text 
        className="text-lg font-medium mt-4 mb-2"
        style={{ color: themeColors.text.primary }}
      >
        Nenhuma conversa ainda
      </Text>
      <Text 
        className="text-sm text-center"
        style={{ color: themeColors.text.secondary }}
      >
        Inicie sua primeira conversa com Rachel!
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 items-center justify-center px-10">
      <Ionicons name="alert-circle-outline" size={48} color={Colors.error[500]} />
      <Text 
        className="text-lg font-medium mt-4 mb-5"
        style={{ color: Colors.error[500] }}
      >
        Erro ao carregar conversas
      </Text>
      <TouchableOpacity 
        className="px-5 py-3 rounded-lg"
        style={{ backgroundColor: `${Colors.primary[500]}20` }}
      >
        <Text 
          className="font-medium"
          style={{ color: Colors.primary[500] }}
        >
          Tentar novamente
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View 
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Header */}
      <View 
        className="flex-row justify-between items-center px-5 py-4 pt-12 border-b"
        style={{ 
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border 
        }}
      >
        <View className="flex-1">
          <Text 
            className="text-2xl font-bold"
            style={{ color: themeColors.text.primary }}
          >
            Conversas
          </Text>
          {stats.total > 0 && (
            <Text 
              className="text-sm"
              style={{ color: themeColors.text.secondary }}
            >
              {stats.total} conversa{stats.total !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${Colors.primary[500]}20` }}
          onPress={handleNewConversation}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {conversationsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text 
              className="text-base mt-4"
              style={{ color: themeColors.text.secondary }}
            >
              Carregando conversas...
            </Text>
          </View>
        ) : conversationsError ? (
          renderError()
        ) : conversations.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={conversations}
            renderItem={({ item }) => <ConversationItem item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </View>
    </View>
  );
}