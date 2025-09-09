export const API_CONFIG = {
  BASE_URL: 'http://192.168.50.132:8000', // home
//   BASE_URL: 'http://186.217.113.53:8000',
  TIMEOUT: 30000, // 30 seconds
  
  ENDPOINTS: {
    AUDIO_NEW: '/audio/new',
    AUDIO_CHAT: (conversationId: string) => `/audio/chat/${conversationId}`,
    AUDIO_RESET: '/audio/reset',
    
    CONVERSATIONS_LIST: '/conversations/',
    CONVERSATION_DETAIL: (conversationId: string) => `/conversations/${conversationId}`,
    
    AUTH_LOGIN: '/auth/token',
    AUTH_REGISTER: '/auth/',
    AUTH_ME: '/users/me',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
  AUDIO_SETTINGS: 'audio_settings',
  CONVERSATION_AUDIOS: 'conversation_audios',
} as const;

export const AUDIO_CONFIG = {
  MIN_RECORDING_DURATION: 500, // milliseconds
  MAX_RECORDING_DURATION: 120000, // 2 minutes
  SAMPLE_RATE: 44100,
  BIT_RATE: 128000,
  CHANNELS: 1,
} as const;

export const APP_CONFIG = {
  NAME: 'AzureJay',
  VERSION: '1.0.0',
  BUILD_VERSION: 'Beta 0.1',
  DESCRIPTION: 'Seu tutor de inglês por voz',
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  DRAWER_WIDTH_PERCENTAGE: 0.85,
  MODAL_ANIMATION_DURATION: 250,
  RECORDING_CANCEL_THRESHOLD: -80,
} as const;

export const QUERY_KEYS = {
  AUTH: ['auth'],
  AUTH_STORED: ['auth', 'stored'],
  CONVERSATIONS: ['conversations'],
  CONVERSATION_DETAIL: (id: string) => ['conversations', id],
} as const;