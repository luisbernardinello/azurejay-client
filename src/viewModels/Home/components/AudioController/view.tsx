import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../../../shared/utils/colors';
import { APP_CONFIG } from '../../../../shared/utils/constants';
import { useHomeModel } from '../../model';
import { AudioVisualizerView } from '../AudioVisualizer/view';

type AudioControllerViewProps = ReturnType<typeof useHomeModel>;

export function AudioControllerView({
  audioState,
  isManualPlayback,
  startRecording,
  stopRecording,
  cancelRecording,
  playAudio,
  stopPlayback,
  handleOpenDrawer,
  handleOpenTranscription,
  getStatusText,
  canInteract,
}: AudioControllerViewProps) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

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
          className="flex-row justify-between items-center px-5 py-3"
          style={{ backgroundColor: themeColors.surface }}
        >
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            onPress={handleOpenDrawer}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="menu" 
              size={24} 
              color={themeColors.text.primary} 
            />
          </TouchableOpacity>
          
          <Text 
            className="text-lg font-semibold flex-1 text-center"
            style={{ color: themeColors.text.primary }}
          >
            {APP_CONFIG.NAME}
          </Text>
          
          <View className="w-10 items-end">
            {audioState.currentConversationId && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center"
                onPress={handleOpenTranscription}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="document-text-outline" 
                  size={20} 
                  color={themeColors.text.primary} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 justify-center items-center px-8">
          
          {/* Status Text */}
          <View className="absolute top-20 items-center">
            <Text 
              className="text-base font-medium text-center"
              style={{ color: themeColors.text.primary }}
            >
              {getStatusText()}
            </Text>
            
            {audioState.currentState === 'recording' && (
              <Text 
                className="text-sm mt-2 text-center"
                style={{ color: themeColors.text.secondary }}
              >
                Arraste até o canto esquerdo para cancelar
              </Text>
            )}
          </View>

          {/* Central Audio Visualizer */}
          <AudioVisualizerView
            isRecording={audioState.isRecording}
            isPlaying={audioState.isPlaying}
            isLoading={audioState.isLoading}
            onPressIn={canInteract ? startRecording : () => {}}
            onPressOut={canInteract ? stopRecording : () => {}}
            onCancelRecording={cancelRecording}
            audioLevel={audioState.audioLevel}
            currentState={audioState.currentState}
            disabled={!canInteract}
          />

          {/* Replay Button - Show when idle and has audio */}
          {audioState.lastAudioUri && audioState.currentState === 'idle' && (
            <TouchableOpacity
              className="absolute bottom-20 flex-row items-center px-5 py-3 border rounded-full"
              style={{
                backgroundColor: themeColors.surface,
                borderColor: `${Colors.primary[500]}30`,
              }}
              onPress={() => {
                playAudio();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="play-outline" size={20} color={Colors.primary[500]} />
              <Text 
                className="text-sm font-medium ml-2"
                style={{ color: Colors.primary[500] }}
              >
                Repetir
              </Text>
            </TouchableOpacity>
          )}

          {/* Stop Playback Button - Show during manual playback */}
          {audioState.currentState === 'playing' && isManualPlayback && (
            <TouchableOpacity
              className="absolute bottom-20 flex-row items-center px-5 py-3 border rounded-full"
              style={{
                backgroundColor: `${Colors.error[500]}10`,
                borderColor: `${Colors.error[500]}30`,
              }}
              onPress={() => {
                stopPlayback();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="stop-outline" size={20} color={Colors.error[500]} />
              <Text 
                className="text-sm font-medium ml-2"
                style={{ color: Colors.error[500] }}
              >
                Parar
              </Text>
            </TouchableOpacity>
          )}
          
        </View>
      </SafeAreaView>
    </View>
  );
}