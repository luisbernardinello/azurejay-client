import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../../../shared/utils/colors';
import { useSettingItemModel } from './model';

interface SettingItemViewProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  disabled?: boolean;
}

export function SettingItemView({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  disabled = false,
}: SettingItemViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const {
    isPressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    canPress,
  } = useSettingItemModel({ onPress, disabled });

  return (
    <TouchableOpacity
      className={`flex-row items-center px-5 py-4 border-b ${
        disabled ? 'opacity-50' : ''
      }`}
      style={{
        backgroundColor: isPressed ? themeColors.border : themeColors.surface,
        borderBottomColor: themeColors.border,
      }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      disabled={!canPress}
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
        canPress && (
          <Ionicons 
            name="chevron-forward" 
            size={18} 
            color={themeColors.text.tertiary} 
          />
        )
      )}
    </TouchableOpacity>
  );
}