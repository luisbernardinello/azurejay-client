import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AudioState } from '../../../../shared/interfaces/audio.interface';
import { getAudioStateColor } from '../../../../shared/utils/colors';

interface AudioVisualizerModelProps {
  isRecording: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  audioLevel: number;
  currentState: AudioState['currentState'];
}

export const useAudioVisualizerModel = ({
  isRecording,
  isPlaying,
  isLoading,
  audioLevel,
  currentState,
}: AudioVisualizerModelProps) => {
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const dotAnims = useRef([
    new Animated.Value(0.7),
    new Animated.Value(0.7),
    new Animated.Value(0.7),
  ]).current;
  
  const waveAnims = useRef([
    new Animated.Value(0.8),
    new Animated.Value(1),
    new Animated.Value(0.6),
  ]).current;

  useEffect(() => {
    switch (currentState) {
      case 'recording':
        startRecordingAnimation();
        break;
      case 'processing':
        startProcessingAnimation();
        break;
      case 'playing':
        startPlayingAnimation();
        break;
      case 'idle':
      default:
        startIdleAnimation();
        break;
    }

    return () => {
      rotateAnim.stopAnimation();
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
      dotAnims.forEach(anim => anim.stopAnimation());
      waveAnims.forEach(anim => anim.stopAnimation());
    };
  }, [currentState]);

  useEffect(() => {
    if (currentState === 'recording' || currentState === 'playing') {
      animateAudioPulse();
    } else {
      resetAudioPulse();
    }
  }, [audioLevel, currentState]);

  const animateAudioPulse = () => {
    const normalizedLevel = Math.max(0, Math.min(1, (audioLevel + 60) / 60));
    const targetScale = 1 + (normalizedLevel * 0.3);
    
    Animated.timing(pulseAnim, {
      toValue: targetScale,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const resetAudioPulse = () => {
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const startIdleAnimation = () => {
    scaleAnim.setValue(1);
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const startRecordingAnimation = () => {
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const startProcessingAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    const dotAnimations = dotAnims.map((anim) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    });

    dotAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 200);
    });
  };

  const startPlayingAnimation = () => {
    rotateAnim.setValue(0);
    
    const waveAnimations = waveAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 600 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.6,
            duration: 600 + (index * 100),
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
    });

    waveAnimations.forEach((animation, index) => {
      setTimeout(() => animation.start(), index * 150);
    });
  };

  const handlePressIn = (onPressIn: () => void) => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    onPressIn();
  };

  const handlePressOut = (onPressOut: () => void) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onPressOut();
  };

  const getCircleColor = () => {
    return getAudioStateColor(currentState);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return {
    scaleAnim,
    pulseAnim,
    rotateAnim,
    dotAnims,
    waveAnims,
    handlePressIn,
    handlePressOut,
    getCircleColor,
    rotateInterpolate,
  };
};