import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { audioApi } from '../api/audio-api';
import { CreateConversationResponse } from '../interfaces/audio.interface';

export class AudioService {
  async saveAudioFile(audioContent: ArrayBuffer): Promise<string> {
    const fileUri = `${FileSystem.documentDirectory}rachel_response_${Date.now()}.mp3`;
    
    const uint8Array = new Uint8Array(audioContent);
    const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    const base64String = btoa(binaryString);
    
    await FileSystem.writeAsStringAsync(fileUri, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return fileUri;
  }

  async cleanupAudioFiles(): Promise<void> {
    try {
      const directory = FileSystem.documentDirectory;
      if (directory) {
        const files = await FileSystem.readDirectoryAsync(directory);
        const audioFiles = files.filter(file => 
          file.startsWith('rachel_response_') && file.endsWith('.mp3')
        );
        
        const deletePromises = audioFiles.map(file => 
          FileSystem.deleteAsync(`${directory}${file}`, { idempotent: true })
        );
        
        await Promise.all(deletePromises);
      }
    } catch (error) {
      console.warn('Error cleaning up audio files:', error);
    }
  }
}

export const audioService = new AudioService();

export const useCreateAudioConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (audioUri: string): Promise<CreateConversationResponse & { savedAudioUri: string }> => {
      const response = await audioApi.createAudioConversation(audioUri);
      const savedAudioUri = await audioService.saveAudioFile(response.audioContent);
      
      return {
        ...response,
        savedAudioUri,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useContinueAudioConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, audioUri }: { conversationId: string; audioUri: string }) => {
      const audioContent = await audioApi.continueAudioConversation(conversationId, audioUri);
      const savedAudioUri = await audioService.saveAudioFile(audioContent);
      return { savedAudioUri };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.conversationId] });
    },
  });
};
