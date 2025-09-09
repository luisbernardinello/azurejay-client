import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { AudioState } from '../../shared/interfaces/audio.interface';
import { useContinueAudioConversation, useCreateAudioConversation } from '../../shared/services/audio.service';
import { useAuth } from '../../shared/services/auth.service';
import { useConversations } from '../../shared/services/conversation.service';
import { conversationAudioService } from '../../shared/services/conversationAudio.service';
import { AUDIO_CONFIG } from '../../shared/utils/constants';

export const useHomeModel = () => {
  const auth = useAuth();
  const conversations = useConversations();
  const createConversation = useCreateAudioConversation();
  const continueConversation = useContinueAudioConversation();

  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(audioRecorder);
  const player = useAudioPlayer();

  // Refs for audio monitoring
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioTimeRef = useRef<number>(0);

  // State
  const [audioState, setAudioState] = useState<AudioState>({
    currentState: 'idle',
    isRecording: false,
    isPlaying: false,
    isLoading: false,
    audioLevel: -60,
    lastAudioUri: null,
    currentConversationId: null,
  });

  const [isManualPlayback, setIsManualPlayback] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'transcription'>('chat');

  useEffect(() => {
    if (audioState.currentConversationId && conversations.data && !conversations.isLoading) {
      const conversationExists = conversations.data.find(
        conv => conv.id === audioState.currentConversationId
      );
      
      if (!conversationExists) {
        setAudioState(prev => ({ 
          ...prev, 
          currentConversationId: null,
          lastAudioUri: null 
        }));
        
        if (currentView === 'transcription') {
          setCurrentView('chat');
        }
      }
    }
  }, [conversations.data, conversations.isLoading, audioState.currentConversationId, currentView]);

  // Clean up orphaned audios when conversations data changes
  useEffect(() => {
    if (conversations.data && conversations.data.length > 0) {
      const existingIds = conversations.data.map(conv => conv.id);
      conversationAudioService.cleanupOrphanedAudios(existingIds);
    }
  }, [conversations.data]);

  // Load last audio when conversation changes
  useEffect(() => {
    if (audioState.currentConversationId) {
      const lastAudio = conversationAudioService.getLastAudio(audioState.currentConversationId);
      if (lastAudio !== audioState.lastAudioUri) {
        setAudioState(prev => ({ 
          ...prev, 
          lastAudioUri: lastAudio 
        }));
      }
    }
  }, [audioState.currentConversationId]);

  const cleanupAudioMonitoring = useCallback(() => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    lastAudioTimeRef.current = 0;
  }, []);

  const forceStopAudio = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      console.error(error);
    }
    
    setAudioState(prev => ({ 
      ...prev, 
      currentState: 'idle', 
      isPlaying: false 
    }));
    setIsManualPlayback(false);
    cleanupAudioMonitoring();
  }, [player, cleanupAudioMonitoring]);

  // Audio config
  const configureAudioForPlayback = useCallback(async () => {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
        shouldPlayInBackground: false,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const configureAudioForRecording = useCallback(async () => {
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
        shouldPlayInBackground: false,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await AudioModule.requestRecordingPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permissão do microfone é necessária.');
        return false;
      }
      
      await configureAudioForRecording();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [configureAudioForRecording]);

  const startRecording = useCallback(async () => {
    if (audioState.currentState === 'playing' || audioState.currentState === 'processing') {
      return;
    }

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await configureAudioForRecording();
      
      setAudioState(prev => ({ 
        ...prev, 
        currentState: 'recording',
        isRecording: true 
      }));
      
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error(error);
      setAudioState(prev => ({ ...prev, currentState: 'idle', isRecording: false }));
      Alert.alert('Erro', 'Falha ao iniciar gravação');
    }
  }, [audioRecorder, requestPermissions, configureAudioForRecording, audioState.currentState]);

  const stopRecording = useCallback(async () => {
    try {
      setAudioState(prev => ({ 
        ...prev, 
        currentState: 'processing',
        isRecording: false,
        isLoading: true 
      }));
      
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      
      if (uri && recorderState.durationMillis > AUDIO_CONFIG.MIN_RECORDING_DURATION) {
        await handleAudioUpload(uri);
      } else {
        Alert.alert('Aviso', 'Gravação muito curta');
        setAudioState(prev => ({ ...prev, currentState: 'idle', isLoading: false }));
      }
    } catch (error) {
      console.error(error);
      setAudioState(prev => ({ ...prev, currentState: 'idle', isLoading: false }));
      Alert.alert('Erro', 'Falha ao parar gravação');
    }
  }, [audioRecorder, recorderState.durationMillis]);

  const cancelRecording = useCallback(async () => {
    try {
      await audioRecorder.stop();
      
      setAudioState(prev => ({ 
        ...prev, 
        currentState: 'idle',
        isRecording: false,
        isLoading: false 
      }));
    } catch (error) {
      console.error(error);
      setAudioState(prev => ({ ...prev, currentState: 'idle', isRecording: false, isLoading: false }));
    }
  }, [audioRecorder]);

  const handleAudioUpload = useCallback(async (audioUri: string) => {
    if (!auth.token) {
      Alert.alert('Erro de Autenticação', 'Token de acesso não encontrado. Faça login novamente.');
      setAudioState(prev => ({ ...prev, currentState: 'idle', isLoading: false }));
      return;
    }

    try {
      if (!audioState.currentConversationId) {
        const result = await createConversation.mutateAsync(audioUri);
        
        await conversationAudioService.setLastAudio(result.conversationId, result.savedAudioUri);
        
        setAudioState(prev => ({ 
          ...prev, 
          currentConversationId: result.conversationId,
          lastAudioUri: result.savedAudioUri
        }));
        await playAudio(result.savedAudioUri, false);
      } else {
        const result = await continueConversation.mutateAsync({
          conversationId: audioState.currentConversationId,
          audioUri
        });
        
        await conversationAudioService.setLastAudio(audioState.currentConversationId, result.savedAudioUri);
        
        setAudioState(prev => ({ ...prev, lastAudioUri: result.savedAudioUri }));
        await playAudio(result.savedAudioUri, false);
      }
    } catch (error: any) {
      console.error(error);
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
        );
      } else if (error instanceof Error && error.message.includes('autorizado')) {
        Alert.alert(
          'Sessão Expirada',
          'Sua sessão expirou. Faça login de novo.'
        );
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        Alert.alert('Erro', `Falha ao enviar audio: ${errorMessage}`);
      }
      
      setAudioState(prev => ({ ...prev, currentState: 'idle', isLoading: false }));
    }
  }, [auth.token, audioState.currentConversationId, createConversation, continueConversation]);

  const playAudio = useCallback(async (audioUri: string, isManual: boolean = false) => {
    try {
      cleanupAudioMonitoring();
      
      await configureAudioForPlayback();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setAudioState(prev => ({ 
        ...prev, 
        currentState: 'playing',
        isPlaying: true,
        isLoading: false 
      }));
      
      setIsManualPlayback(isManual);
      
      try {
        player.pause();
      } catch (e) {
        console.log(e)
      }
      
      player.replace({ uri: audioUri });
      player.volume = 1.0;
      player.play();
      
      audioTimeoutRef.current = setTimeout(() => {
        forceStopAudio();
        Alert.alert('Aviso', 'Reprodução de áudio expirou. Tente novamente.');
      }, 30000);
      
    } catch (error) {
      console.error(error);
      setAudioState(prev => ({ ...prev, currentState: 'idle', isPlaying: false, isLoading: false }));
      setIsManualPlayback(false);
      cleanupAudioMonitoring();
      Alert.alert('Erro', 'Falha ao reproduzir áudio. Tente novamente.');
    }
  }, [player, configureAudioForPlayback, cleanupAudioMonitoring, forceStopAudio]);

  const stopPlayback = useCallback(() => {
    forceStopAudio();
  }, [forceStopAudio]);

  // Navigation actions
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  
  const handleNewConversation = () => {
    setAudioState(prev => ({ ...prev, currentConversationId: null, lastAudioUri: null }));
    setCurrentView('chat');
    handleCloseDrawer();
  };

  const handleSelectConversation = (conversationId: string) => {
    const lastAudio = conversationAudioService.getLastAudio(conversationId);
    
    setAudioState(prev => ({ 
      ...prev, 
      currentConversationId: conversationId,
      lastAudioUri: lastAudio
    }));
    setCurrentView('transcription');
    handleCloseDrawer();
  };

  const handleOpenTranscription = () => {
    if (audioState.currentConversationId) {
      setCurrentView('transcription');
    }
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  // Effects
  useEffect(() => {
    requestPermissions();
  }, []);

  // audio playback monitoring
  useEffect(() => {
    if (audioState.currentState === 'playing') {
      let consecutiveStuckCount = 0;
      
      audioIntervalRef.current = setInterval(() => {
        const isPlaying = player.playing;
        const currentTime = player.currentTime;
        const duration = player.duration;
        
        // Check if audio is stuck
        if (currentTime === lastAudioTimeRef.current && isPlaying) {
          consecutiveStuckCount++;
          
          if (consecutiveStuckCount >= 3) {
            forceStopAudio();
            Alert.alert('Erro', 'Problema na reprodução do áudio. Tente novamente.');
            return;
          }
        } else {
          consecutiveStuckCount = 0;
        }
        
        lastAudioTimeRef.current = currentTime;
        
        if (!isPlaying && currentTime > 0) {
          setAudioState(prev => ({
            ...prev, 
            currentState: 'idle', 
            isPlaying: false 
          }));
          
          setIsManualPlayback(false);
          cleanupAudioMonitoring();
        }
        
        // Duration-based completion (fallback)
        if (duration > 0 && currentTime >= duration - 0.1) {
          setAudioState(prev => ({ 
            ...prev, 
            currentState: 'idle', 
            isPlaying: false 
          }));
          
          setIsManualPlayback(false);
          cleanupAudioMonitoring();
        }
        
      }, 500); // Check every 500ms
    }

    return cleanupAudioMonitoring;
  }, [audioState.currentState, player, cleanupAudioMonitoring, forceStopAudio]);

  useEffect(() => {
    if (audioState.isRecording) {
      setAudioState(prev => ({ ...prev, audioLevel: recorderState.metering || -60 }));
    }
  }, [recorderState.metering, audioState.isRecording]);

  return {
    audioState,
    isDrawerOpen,
    isDrawerVisible,
    currentView,
    conversations: conversations.data || [],
    conversationsLoading: conversations.isLoading,
    conversationsError: conversations.error,
    isManualPlayback,
    
    startRecording,
    stopRecording,
    cancelRecording,
    playAudio: () => {
      if (audioState.lastAudioUri) {
        playAudio(audioState.lastAudioUri, true);
      }
    },
    stopPlayback,
    handleOpenDrawer,
    handleCloseDrawer,
    handleNewConversation,
    handleSelectConversation,
    handleOpenTranscription,
    handleBackToChat,
    setIsDrawerVisible,
    
    canInteract: audioState.currentState !== 'playing' && audioState.currentState !== 'processing',
    
    getStatusText: () => {
      switch (audioState.currentState) {
        case 'recording': return 'Ouvindo...';
        case 'processing': return 'Pensando...';
        case 'playing': return 'Rachel está falando';
        case 'idle':
        default: return audioState.lastAudioUri ? 'Toque para falar' : 'Comece uma conversa';
      }
    },
  };
};