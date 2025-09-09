import { CreateConversationResponse } from '../interfaces/audio.interface';
import { coreApi } from './core-api';

export class AudioApi {
  async createAudioConversation(audioUri: string): Promise<CreateConversationResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);

    const response = await fetch(`${coreApi['client'].defaults.baseURL}/audio/new`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${coreApi['authToken']}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const conversationId = response.headers.get('X-Conversation-ID');
    const title = response.headers.get('X-Conversation-Title');
    const audioContent = await response.arrayBuffer();

    if (!conversationId || !title) {
      throw new Error('Conversation ID or title not found in response headers');
    }

    return {
      conversationId,
      title,
      audioContent,
    };
  }

  async continueAudioConversation(conversationId: string, audioUri: string): Promise<ArrayBuffer> {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);

    return await coreApi.postFormDataWithArrayBuffer(`/audio/chat/${conversationId}`, formData);
  }

  async resetConversation(): Promise<void> {
    await coreApi.get('/audio/reset');
  }
}

export const audioApi = new AudioApi();