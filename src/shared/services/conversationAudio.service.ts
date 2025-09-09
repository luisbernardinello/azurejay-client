import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { STORAGE_KEYS } from '../utils/constants';

interface ConversationAudio {
  conversationId: string;
  audioUri: string;
  timestamp: number;
}

export class ConversationAudioService {
  private static readonly STORAGE_KEY = STORAGE_KEYS.CONVERSATION_AUDIOS;
  private audioMap = new Map<string, string>();

  constructor() {
    this.loadStoredAudios();
  }

  private async loadStoredAudios(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ConversationAudioService.STORAGE_KEY);
      if (stored) {
        const audioData: ConversationAudio[] = JSON.parse(stored);
        
        for (const audio of audioData) {
          const fileExists = await FileSystem.getInfoAsync(audio.audioUri);
          if (fileExists.exists) {
            this.audioMap.set(audio.conversationId, audio.audioUri);
          }
        }
        
        await this.saveToStorage();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      const audioData: ConversationAudio[] = Array.from(this.audioMap.entries()).map(
        ([conversationId, audioUri]) => ({
          conversationId,
          audioUri,
          timestamp: Date.now(),
        })
      );
      
      await AsyncStorage.setItem(
        ConversationAudioService.STORAGE_KEY,
        JSON.stringify(audioData)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async setLastAudio(conversationId: string, audioUri: string): Promise<void> {
    try {
      const previousAudio = this.audioMap.get(conversationId);
      if (previousAudio && previousAudio !== audioUri) {
        // Deletes the previous audio when receiving a new one
        await this.deleteAudioFile(previousAudio);
      }
      
      this.audioMap.set(conversationId, audioUri);
      await this.saveToStorage();
      
    } catch (error) {
      console.error(error);
    }
  }

  getLastAudio(conversationId: string): string | null {
    const audioUri = this.audioMap.get(conversationId);
    return audioUri || null;
  }

  async removeConversationAudio(conversationId: string): Promise<void> {
    try {
      const audioUri = this.audioMap.get(conversationId);
      if (audioUri) {
        await this.deleteAudioFile(audioUri);
        this.audioMap.delete(conversationId);
        await this.saveToStorage();
      }
    } catch (error) {
      console.error(error);
    }
  }


  async clearAllAudios(): Promise<void> {
    try {
      for (const audioUri of this.audioMap.values()) {
        await this.deleteAudioFile(audioUri);
      }
      
      this.audioMap.clear();
      await AsyncStorage.removeItem(ConversationAudioService.STORAGE_KEY);
      
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteAudioFile(audioUri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(audioUri, { idempotent: true });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  getConversationsWithAudio(): string[] {
    return Array.from(this.audioMap.keys());
  }

  async cleanupOrphanedAudios(existingConversationIds: string[]): Promise<void> {
    try {
      const storedIds = this.getConversationsWithAudio();
      const orphanedIds = storedIds.filter(id => !existingConversationIds.includes(id));
      
      for (const orphanedId of orphanedIds) {
        await this.removeConversationAudio(orphanedId);
      }
      
    } catch (error) {
      console.error(error);
    }
  }
}

export const conversationAudioService = new ConversationAudioService();