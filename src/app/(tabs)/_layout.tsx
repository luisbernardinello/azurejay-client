import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <ProtectedRoute requireAuth={true} redirectTo="/(auth)/login">
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#F5F5F5',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Conversa',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons 
              name={focused ? 'chatbubble' : 'chatbubble-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
    </ProtectedRoute>
  );
}