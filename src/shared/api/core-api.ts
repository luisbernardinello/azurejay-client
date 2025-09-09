import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ApiError, RequestConfig } from '../interfaces/api.interface';
import { API_CONFIG } from '../utils/constants';

class CoreApi {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private isHandlingTokenExpiration = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor for auth tokens
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.detail || error.message || 'Network error',
          status: error.response?.status || 0,
          details: error.response?.data,
        };

        // Handle 401 error (token expired/invalid)
        if (error.response?.status === 401 && !this.isHandlingTokenExpiration) {
          this.handleTokenExpiration();
        }

        return Promise.reject(apiError);
      }
    );
  }

  private async handleTokenExpiration() {
    if (this.isHandlingTokenExpiration) {
      return;
    }
    
    this.isHandlingTokenExpiration = true;
    
    try {
      this.clearAuthToken();
      
      const { authService } = await import('../services/auth.service');
      await authService.forceLogout();
      
      // Wait for React Query to process the logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Alert.alert(
        'Sessão Expirada',
        'Sua sessão expirou. Por favor, faça login novamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.performLogoutNavigation();
            }
          }
        ],
        { 
          cancelable: false,
          onDismiss: () => {
            this.performLogoutNavigation();
          }
        }
      );
      
    } catch (error) {
      console.error(error);
      this.performLogoutNavigation();
    }
  }

  private async performLogoutNavigation() {
    try {
      this.isHandlingTokenExpiration = false;
      
      // A small delay to ensure state has settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.dismissAll();
      router.replace('/(auth)/login');
      
      
    } catch (navigationError) {
      console.error(navigationError);
      this.isHandlingTokenExpiration = false;
      
      setTimeout(() => {
        try {
          router.replace('/(auth)/login');
        } catch (retryError) {
          console.error(retryError);
        }
      }, 1000);
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
    this.isHandlingTokenExpiration = false;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  isHandlingExpiration(): boolean {
    return this.isHandlingTokenExpiration;
  }

  resetExpirationFlag(): void {
    this.isHandlingTokenExpiration = false;
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config as AxiosRequestConfig);
    return response.data;
  }

  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async postFormDataWithArrayBuffer(url: string, formData: FormData): Promise<ArrayBuffer> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });
    return response.data;
  }
}

export const coreApi = new CoreApi();