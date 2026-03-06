import { api } from '@/lib/api';
import { authUtils } from '@/lib/auth';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UpdateProfileData,
} from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    authUtils.setToken(response.access_token);
    authUtils.setUser(response.user);
    return response;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    authUtils.setToken(response.access_token);
    authUtils.setUser(response.user);
    return response;
  },

  logout(): void {
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
};