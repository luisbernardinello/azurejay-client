import { useState } from 'react';

interface SettingItemModelProps {
  onPress?: () => void;
  disabled?: boolean;
}

export const useSettingItemModel = ({ onPress, disabled = false }: SettingItemModelProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (!disabled && onPress) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return {
    isPressed,
    handlePressIn,
    handlePressOut,
    handlePress,
    canPress: !disabled && !!onPress,
  };
};