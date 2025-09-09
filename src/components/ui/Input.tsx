import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../shared/utils/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  isPassword?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export function Input({
  label,
  error,
  icon,
  iconPosition = 'left',
  isPassword = false,
  disabled = false,
  required = false,
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getInputClasses = () => {
    const baseClasses = 'flex-row items-center border rounded-xl px-4 h-14';
    const stateClasses = error 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
      : isFocused 
        ? 'border-primary-500 bg-white dark:bg-gray-800' 
        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    const disabledClasses = disabled ? 'opacity-50' : '';
    
    return `${baseClasses} ${stateClasses} ${disabledClasses}`;
  };

  const getIconColor = () => {
    if (error) return Colors.error[500];
    if (isFocused) return Colors.primary[500];
    return themeColors.text.tertiary;
  };

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text className="text-base font-semibold text-black dark:text-white mb-2">
          {label}
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </Text>
      )}

      {/* Input Container */}
      <View className={getInputClasses()}>
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={getIconColor()} 
          />
        )}

        {/* Text Input */}
        <TextInput
          className="flex-1 text-base text-black dark:text-white h-full"
          style={{ marginLeft: icon && iconPosition === 'left' ? 12 : 0 }}
          placeholderTextColor={themeColors.text.tertiary}
          secureTextEntry={isPassword && !showPassword}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={handleTogglePassword}
            className="p-1 ml-2"
            disabled={disabled}
          >
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={themeColors.text.tertiary} 
            />
          </TouchableOpacity>
        )}

        {/* Right Icon */}
        {icon && iconPosition === 'right' && !isPassword && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={getIconColor()} 
          />
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}