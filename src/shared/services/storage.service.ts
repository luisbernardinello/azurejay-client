import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return Array.from(await AsyncStorage.getAllKeys());
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export const storageService = new StorageService();