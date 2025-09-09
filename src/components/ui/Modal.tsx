import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal as RNModal, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getThemeColors } from '../../shared/utils/colors';
import { Button } from './Button';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  actions?: {
    primary?: {
      title: string;
      onPress: () => void;
      loading?: boolean;
    };
    secondary?: {
      title: string;
      onPress: () => void;
    };
  };
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'slide',
  size = 'medium',
  actions,
}: ModalProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return {
          width: screenWidth * 0.8,
          maxHeight: screenHeight * 0.4,
        };
      case 'medium':
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        };
      case 'large':
        return {
          width: screenWidth * 0.95,
          maxHeight: screenHeight * 0.8,
        };
      case 'fullscreen':
        return {
          width: screenWidth,
          height: screenHeight,
        };
      default:
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        };
    }
  };

  const modalSize = getModalSize();

  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={size !== 'fullscreen'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        {size === 'fullscreen' ? (
          // Fullscreen modal
          <View className="flex-1 bg-white dark:bg-black">
            {/* Header */}
            {(title || showCloseButton) && (
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-bold text-black dark:text-white flex-1">
                  {title || ''}
                </Text>
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    className="w-10 h-10 rounded-full items-center justify-center"
                  >
                    <Ionicons 
                      name="close" 
                      size={24} 
                      color={themeColors.text.secondary} 
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Content */}
            <View className="flex-1">
              {children}
            </View>
          </View>
        ) : (
          // Overlay modal
          <View 
            className="flex-1 items-center justify-center px-4"
            style={{ backgroundColor: themeColors.overlay }}
          >
            <View
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
              style={modalSize}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                  <Text className="text-lg font-bold text-black dark:text-white flex-1">
                    {title || ''}
                  </Text>
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      className="w-8 h-8 rounded-full items-center justify-center"
                    >
                      <Ionicons 
                        name="close" 
                        size={20} 
                        color={themeColors.text.secondary} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {/* Content */}
              <View className="flex-1 p-5">
                {children}
              </View>

              {/* Actions */}
              {actions && (
                <View className="flex-row gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                  {actions.secondary && (
                    <Button
                      title={actions.secondary.title}
                      onPress={actions.secondary.onPress}
                      variant="outline"
                      style={{ flex: 1 }}
                    />
                  )}
                  {actions.primary && (
                    <Button
                      title={actions.primary.title}
                      onPress={actions.primary.onPress}
                      loading={actions.primary.loading}
                      style={{ flex: 1 }}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </GestureHandlerRootView>
    </RNModal>
  );
}