export interface AudioState {
  currentState: 'idle' | 'recording' | 'processing' | 'playing';
  isRecording: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  audioLevel: number;
  lastAudioUri: string | null;
  currentConversationId: string | null;
}

export interface AudioControllerProps {
  onConversationCreated?: (conversationId: string, title: string) => void;
  onOpenDrawer?: () => void;
  onOpenTranscription?: () => void;
  currentConversationId?: string;
}

export interface CreateConversationResponse {
  conversationId: string;
  title: string;
  audioContent: ArrayBuffer;
}