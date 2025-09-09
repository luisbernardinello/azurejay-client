export const Colors = {
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#4A90E2',
    600: '#3182CE',
    700: '#2C5282',
    800: '#2A4365',
    900: '#1A365D',
  },

  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  audio: {
    idle: '#6B7280',
    recording: '#22C55E',
    processing: '#F59E0B',
    playing: '#22C55E',
    error: '#EF4444',
  },

  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    border: '#E5E7EB',
    input: {
      background: '#F9FAFB',
      border: '#D1D5DB',
      borderFocus: '#4A90E2',
      borderError: '#EF4444',
    },
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  dark: {
    background: '#000000',
    surface: '#111827',
    card: '#1F2937',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
    },
    border: '#374151',
    input: {
      background: '#1F2937',
      border: '#374151',
      borderFocus: '#4A90E2',
      borderError: '#EF4444',
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

/**
 * Helper functions
 */
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};


export const getAudioStateColor = (state: 'idle' | 'recording' | 'processing' | 'playing') => {
  return Colors.audio[state];
};


export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info', shade: number = 500) => {
  return Colors[status][shade as keyof typeof Colors.success];
};

export default Colors;