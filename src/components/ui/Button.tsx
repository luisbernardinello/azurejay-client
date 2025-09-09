import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native';
import { Colors, getThemeColors } from '../../shared/utils/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

  const getButtonClasses = () => {
    const baseClasses = 'rounded-xl items-center justify-center flex-row';
    
    const variantClasses = {
      primary: 'bg-primary-500',
      secondary: 'bg-gray-200 dark:bg-gray-700',
      outline: 'border-2 border-primary-500 bg-transparent',
      ghost: 'bg-transparent',
    };
    
    const sizeClasses = {
      small: 'px-3 py-2 h-8',
      medium: 'px-4 py-3 h-12',
      large: 'px-6 py-4 h-14',
    };
    
    const disabledClasses = disabled || loading ? 'opacity-50' : '';
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-semibold';
    
    const variantTextClasses = {
      primary: 'text-white',
      secondary: 'text-black dark:text-white',
      outline: 'text-primary-500',
      ghost: 'text-primary-500',
    };
    
    const sizeTextClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    
    return `${baseClasses} ${variantTextClasses[variant]} ${sizeTextClasses[size]}`;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return themeColors.text.primary;
      case 'outline':
      case 'ghost':
        return Colors.primary[500];
      default:
        return Colors.primary[500];
    }
  };

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const iconColor = getIconColor();

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={{ marginRight: 8 }} />
          )}
          <Text className={getTextClasses()} style={textStyle}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}