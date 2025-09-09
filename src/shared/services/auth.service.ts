import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { coreApi } from '../api/core-api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../interfaces/auth.interface';
import { QUERY_KEYS, STORAGE_KEYS } from '../utils/constants';

export class AuthService {
  async storeAuthData(token: string, user: User): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      ]);
      coreApi.setAuthToken(token);
    } catch (error) {
      console.error('Store auth data error:', error);
      throw error;
    }
  }

  async getStoredAuthData(): Promise<{ token: string; user: User } | null> {
    try {
      const [token, userString] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (token && userString) {
        const user = JSON.parse(userString);
        coreApi.setAuthToken(token);
        return { token, user };
      }
      
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      coreApi.clearAuthToken();
    } catch (error) {
      console.error(error);
    }
  }

  async forceLogout(): Promise<void> {
    try {
      
      await this.clearAuthData();
      
      const { QueryClient } = await import('@tanstack/react-query');
      const queryClient = new QueryClient();
      
      queryClient.setQueryData(QUERY_KEYS.AUTH_STORED, null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
      
    } catch (error) {
      console.error(error);
      await this.clearAuthData();
    }
  }
}

export const authService = new AuthService();

// React Query Hooks for Auth
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const response = await authApi.login(credentials);
      await authService.storeAuthData(response.access_token, response.user);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_STORED, {
        token: data.access_token,
        user: data.user
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => {
      return authApi.register(userData);
    },
    onSuccess: () => {
      console.log('Registration successful');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTH_STORED,
    queryFn: () => authService.getStoredAuthData(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const logout = useMutation({
    mutationFn: async () => {
      await authService.clearAuthData();
    },
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_STORED, null);
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });

  return {
    user: authData?.user || null,
    token: authData?.token || null,
    isAuthenticated: !!authData?.token && !!authData?.user,
    isLoading,
    login: useLogin(),
    register: useRegister(),
    logout: logout.mutate,
  };
};