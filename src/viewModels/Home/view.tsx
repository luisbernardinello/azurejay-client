import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, TouchableOpacity, useColorScheme, View } from 'react-native';
import { UI_CONFIG } from '../../shared/utils/constants';
import { TranscriptionView } from '../Transcription/view';
import { AudioControllerView } from './components/AudioController/view';
import { DrawerMenuView } from './components/DrawerMenu/view';
import { useHomeModel } from './model';

const { width: screenWidth } = Dimensions.get('window');

export function HomeView() {
  const colorScheme = useColorScheme();
  const homeModel = useHomeModel();
  
  // Drawer animations
  const drawerTranslateX = useRef(new Animated.Value(-screenWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (homeModel.isDrawerOpen) {
      homeModel.setIsDrawerVisible(true);
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: 0,
          duration: UI_CONFIG.MODAL_ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: UI_CONFIG.MODAL_ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: -screenWidth,
          duration: UI_CONFIG.ANIMATION_DURATION.MEDIUM,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: UI_CONFIG.ANIMATION_DURATION.MEDIUM,
          useNativeDriver: true,
        }),
      ]).start(() => {
        homeModel.setIsDrawerVisible(false);
      });
    }
  }, [homeModel.isDrawerOpen]);

  const renderCurrentView = () => {
    if (homeModel.currentView === 'transcription' && homeModel.audioState.currentConversationId) {
      return (
        <TranscriptionView
          conversationId={homeModel.audioState.currentConversationId}
          onClose={() => homeModel.handleBackToChat()}
          onBackToChat={homeModel.handleBackToChat}
        />
      );
    }

    return <AudioControllerView {...homeModel} />;
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Main Content */}
      {renderCurrentView()}

      {/* Drawer Modal */}
      {homeModel.isDrawerVisible && (
        <Modal
          visible={true}
          animationType="none"
          transparent={true}
          onRequestClose={homeModel.handleCloseDrawer}
          statusBarTranslucent={true}
        >
          <Animated.View 
            className="absolute inset-0 flex-row"
            style={{
              opacity: overlayOpacity,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            <Animated.View 
              className="bg-white dark:bg-gray-900 shadow-2xl"
              style={{
                width: screenWidth * UI_CONFIG.DRAWER_WIDTH_PERCENTAGE,
                height: '100%',
                transform: [{ translateX: drawerTranslateX }]
              }}
            >
              <SafeAreaView className="flex-1">
                <DrawerMenuView {...homeModel} />
              </SafeAreaView>
            </Animated.View>

            <TouchableOpacity 
              className="flex-1 bg-transparent"
              activeOpacity={1}
              onPress={homeModel.handleCloseDrawer}
            />
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}