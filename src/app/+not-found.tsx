import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { SafeAreaView, StatusBar, Text, useColorScheme, View } from 'react-native';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 bg-white dark:bg-black">
        <StatusBar 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent" 
          translucent 
        />
        
        <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight || 44 }}>
          <View className="flex-1 items-center justify-center px-5">
            <Ionicons 
              name="alert-circle-outline" 
              size={64} 
              color={colorScheme === 'dark' ? '#666' : '#999'} 
            />
            
            <Text className="text-2xl font-bold text-black dark:text-white mt-6 mb-3 text-center">
              Página não encontrada
            </Text>
            
            <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8 leading-6">
              A página que você está procurando não existe
            </Text>
            
            <Link href="/" asChild>
              <View className="bg-primary-500 px-6 py-3 rounded-xl">
                <Text className="text-white text-base font-semibold">
                  Voltar
                </Text>
              </View>
            </Link>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}