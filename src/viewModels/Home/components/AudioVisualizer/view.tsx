import { Animated, Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { AudioState } from '../../../../shared/interfaces/audio.interface';
import { UI_CONFIG } from '../../../../shared/utils/constants';
import { useAudioVisualizerModel } from './model';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.6, 240);

interface AudioVisualizerViewProps {
  isRecording: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  audioLevel?: number;
  currentState?: AudioState['currentState'];
  disabled?: boolean;
  onCancelRecording?: () => void;
}

export function AudioVisualizerView({
  isRecording,
  isPlaying,
  isLoading,
  onPressIn,
  onPressOut,
  audioLevel = -60,
  currentState = 'idle',
  disabled = false,
  onCancelRecording,
}: AudioVisualizerViewProps) {
  const {
    scaleAnim,
    pulseAnim,
    rotateAnim,
    dotAnims,
    waveAnims,
    handlePressIn,
    handlePressOut,
    getCircleColor,
    rotateInterpolate,
  } = useAudioVisualizerModel({
    isRecording,
    isPlaying,
    isLoading,
    audioLevel,
    currentState,
  });

  const isPressed = useSharedValue(false);
  const initialX = useSharedValue(0);

  // Gesture for press and swipe
  const combinedGesture = Gesture.Pan()
    .onBegin((event) => {
      if (disabled) return;
      
      isPressed.value = true;
      initialX.value = event.x;
            
      // Start recording
      runOnJS(handlePressIn)(onPressIn);
    })
    .onUpdate((event) => {
      if (disabled || !isPressed.value) return;
      
    })
    .onEnd((event) => {
      if (disabled || !isPressed.value) return;
      
      const deltaX = event.x - initialX.value;
            
      if (deltaX < UI_CONFIG.RECORDING_CANCEL_THRESHOLD && isRecording && onCancelRecording) {
        runOnJS(onCancelRecording)();
      } else {
        runOnJS(handlePressOut)(onPressOut);
      }
      
      // Reset
      isPressed.value = false;
      initialX.value = 0;
    })
    .onFinalize(() => {
      if (isPressed.value) {
        const deltaX = initialX.value;
        
        if (deltaX < UI_CONFIG.RECORDING_CANCEL_THRESHOLD && isRecording && onCancelRecording) {
          runOnJS(onCancelRecording)();
        } else {
          runOnJS(handlePressOut)(onPressOut);
        }
        isPressed.value = false;
        initialX.value = 0;
      }
    });

  return (
    <GestureDetector gesture={combinedGesture}>
      <View 
        className="items-center justify-center relative" 
        style={{ width: CIRCLE_SIZE + 40, height: CIRCLE_SIZE + 40 }}
      >
        
        {/* Outer circle for active states */}
        {(currentState === 'recording' || currentState === 'playing') && (
          <Animated.View
            className="absolute border-2 rounded-full"
            style={{
              width: CIRCLE_SIZE + 20,
              height: CIRCLE_SIZE + 20,
              borderColor: getCircleColor(),
              transform: [{ scale: Animated.multiply(pulseAnim, 1.1) }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.3],
                outputRange: [0.2, 0.4],
                extrapolate: 'clamp',
              }),
            }}
          />
        )}
        
        {/* Main circle */}
        <Animated.View
          className={`rounded-full items-center justify-center shadow-lg ${disabled ? 'opacity-50' : ''}`}
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            backgroundColor: getCircleColor(),
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: currentState === 'processing' ? rotateInterpolate : '0deg' },
            ],
          }}
        >
          
          {/* Inner content based on state */}
          <View className="items-center justify-center">
            
            {/* Idle state */}
            {currentState === 'idle' && (
              <View className="w-5 h-7 bg-white rounded-xl opacity-70" />
            )}
            
            {/* Recording state */}
            {currentState === 'recording' && (
              <View className="w-4 h-4 bg-white rounded-full" />
            )}
            
            {/* Processing state */}
            {currentState === 'processing' && (
              <View className="flex-row items-center">
                {dotAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    className="w-2 h-2 bg-white rounded-full mx-0.5"
                    style={{
                      transform: [{ scale: anim }],
                      opacity: anim,
                    }}
                  />
                ))}
              </View>
            )}
            
            {/* Playing state */}
            {currentState === 'playing' && (
              <View className="flex-row items-center">
                {waveAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    className={`bg-white rounded-sm mx-0.5 opacity-80 ${
                      index === 0 ? 'w-1 h-3' : index === 1 ? 'w-1 h-5' : 'w-1 h-4'
                    }`}
                    style={{
                      transform: [{ scaleY: anim }],
                    }}
                  />
                ))}
              </View>
            )}
            
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}