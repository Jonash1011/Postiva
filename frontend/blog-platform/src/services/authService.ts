import { api } from '@/lib/api';
import { authUtils } from '@/lib/auth';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UpdateProfileData,
  EditProfileData,
} from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    authUtils.setToken(response.access_token);
    authUtils.setRefreshToken(response.refresh_token);
    authUtils.setUser(response.user);
    return response;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    authUtils.setToken(response.access_token);
    authUtils.setRefreshToken(response.refresh_token);
    authUtils.setUser(response.user);
    return response;
  },

  async logout(): Promise<void> {
    const refreshToken = authUtils.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      } catch {
        // Best-effort server logout; clear locally regardless
      }
    }
    authUtils.clearAuth();
  },

  getCurrentUser(): User | null {
    return authUtils.getUser();
  },

  isAuthenticated(): boolean {
    return authUtils.isAuthenticated();
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const user = await api.patch<User>('/users/profile', data);
    authUtils.setUser(user);
    return user;
  },

  async editProfile(data: EditProfileData): Promise<User> {
    const user = await api.patch<User>('/users/profile/edit', data);
    authUtils.setUser(user);
    return user;
  },

  async fetchProfile(): Promise<User> {
    const user = await api.get<User>('/users/profile');
    authUtils.setUser(user);
    return user;
  },

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};