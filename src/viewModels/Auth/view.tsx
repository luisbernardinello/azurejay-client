import { SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';
import { getThemeColors } from '../../shared/utils/colors';
import { LoginFormView } from './components/LoginForm/view';
import { RegisterFormView } from './components/RegisterForm/view';
import { useAuthModel } from './model';

interface AuthViewProps {
  mode: 'login' | 'register';
}

export function AuthView({ mode }: AuthViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  const authModel = useAuthModel();

  return (
    <View 
      className="flex-1 bg-white dark:bg-black"
      style={{ backgroundColor: themeColors.background }}
    >
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight || 44 }}>
        {mode === 'login' ? (
          <LoginFormView {...authModel} />
        ) : (
          <RegisterFormView {...authModel} />
        )}
      </SafeAreaView>
    </View>
  );
}