import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../shared/utils/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color,
  text,
  overlay = false,
}: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');
  
  const spinnerColor = color || Colors.primary[500];
  
  const containerClasses = overlay 
    ? 'absolute inset-0 items-center justify-center z-50'
    : 'items-center justify-center py-8';

  const overlayStyle = overlay ? {
    backgroundColor: themeColors.overlay,
  } : {};

  return (
    <View className={containerClasses} style={overlayStyle}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text className="text-gray-600 dark:text-gray-400 text-base mt-4 text-center">
          {text}
        </Text>
      )}
    </View>
  );
}