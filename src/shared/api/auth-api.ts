import { AuthResponse, LoginRequest, RegisterRequest, User } from '../interfaces/auth.interface';
import { coreApi } from './core-api';

export class AuthApi {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const tokenResponse = await coreApi.postFormData<{ access_token: string; token_type: string }>('/auth/token', formData);
    
    coreApi.setAuthToken(tokenResponse.access_token);
    const user = await coreApi.get<User>('/users/me');

    return {
      ...tokenResponse,
      user,
    };
  }

  async register(userData: RegisterRequest): Promise<void> {
    await coreApi.post('/auth/', userData);
  }

  async validateToken(): Promise<User> {
    return await coreApi.get<User>('/users/me');
  }

}

export const authApi = new AuthApi();