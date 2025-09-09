import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../shared/utils/colors';
import { useSettingsModel } from './model';

export function SettingsView() {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  const {
    user,
    isLoggingOut,
    toggleColorScheme,
    handleAbout,
    handleLogout,
  } = useSettingsModel();

  function SettingItem({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) {
    return (
      <TouchableOpacity
        className="flex-row items-center px-5 py-4 border-b"
        style={{
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border,
        }}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View 
          className="w-7 h-7 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: `${Colors.primary[500]}20` }}
        >
          <Ionicons name={icon as any} size={18} color={Colors.primary[500]} />
        </View>
        <View className="flex-1 mr-3">
          <Text 
            className="text-base font-medium"
            style={{ color: themeColors.text.primary }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              className="text-sm mt-0.5"
              style={{ color: themeColors.text.secondary }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightComponent || (
          onPress && <Ionicons name="chevron-forward" size={18} color={themeColors.text.tertiary} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
    >
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight || 44 }}>
        {/* Header */}
        <View 
          className="px-5 py-3 min-h-[60px] justify-center"
          style={{ backgroundColor: themeColors.surface }}
        >
          <Text 
            className="text-2xl font-bold"
            style={{ color: themeColors.text.primary }}
          >
            Configurações
          </Text>
        </View>

        <ScrollView className="flex-1">
          
          {/* Account Section */}
          <View className="mt-5">
            <Text 
              className="text-xs font-semibold px-5 mb-2 uppercase tracking-wide"
              style={{ color: themeColors.text.secondary }}
            >
              CONTA
            </Text>
            
            <SettingItem
              icon="person"
              title={user ? `${user.first_name} ${user.last_name}` : 'Usuário'}
              subtitle={user?.email || 'Email não disponível'}
            />
            
            <SettingItem
              icon="log-out"
              title={isLoggingOut ? "Saindo..." : "Sair da conta"}
              subtitle={isLoggingOut ? "Aguarde..." : "Fazer logout do aplicativo"}
              onPress={isLoggingOut ? undefined : handleLogout}
              rightComponent={isLoggingOut ? (
                <View className="w-5 h-5">
                  <Text 
                    className="text-xs"
                    style={{ color: Colors.primary[500] }}
                  >
                    ...
                  </Text>
                </View>
              ) : undefined}
            />
          </View>

          {/* Appearance Section */}
          <View className="mt-5">
            <Text 
              className="text-xs font-semibold px-5 mb-2 uppercase tracking-wide"
              style={{ color: themeColors.text.secondary }}
            >
              APARÊNCIA
            </Text>
            
            <SettingItem
              icon="moon"
              title="Tema escuro"
              subtitle={`Atualmente: ${colorScheme === 'dark' ? 'Escuro' : 'Claro'}`}
              rightComponent={
                <Switch
                  value={colorScheme === 'dark'}
                  onValueChange={toggleColorScheme}
                  trackColor={{ false: themeColors.text.tertiary, true: Colors.primary[500] }}
                  thumbColor={colorScheme === 'dark' ? '#ffffff' : '#f4f3f4'}
                />
              }
            />
          </View>

          {/* Information Section */}
          <View className="mt-5">
            <Text 
              className="text-xs font-semibold px-5 mb-2 uppercase tracking-wide"
              style={{ color: themeColors.text.secondary }}
            >
              INFORMAÇÕES
            </Text>
            
            <SettingItem
              icon="information-circle"
              title="Sobre o AzureJay"
              subtitle="Versão 1.0.0"
              onPress={handleAbout}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}