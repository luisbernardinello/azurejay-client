import { useState } from 'react';
import { Alert, Appearance, useColorScheme } from 'react-native';
import { useAuth } from '../../shared/services/auth.service';
import { APP_CONFIG } from '../../shared/utils/constants';

export const useSettingsModel = () => {
  const auth = useAuth();
  const colorScheme = useColorScheme();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newScheme);
  };

  const handleAbout = () => {
    Alert.alert(
      `Sobre o ${APP_CONFIG.NAME}`,
      `App para auxiliar no aprendizado de inglês através de conversas por voz.\n\nVersão: ${APP_CONFIG.BUILD_VERSION}`,
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await auth.logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return {
    user: auth.user,
    colorScheme,
    isLoggingOut,
    toggleColorScheme,
    handleAbout,
    handleLogout,
  };
};