'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { authService } from '@/services/authService';
import { User, LoginCredentials, RegisterCredentials } from '@/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Validate session with backend — refresh profile to ensure token is still valid
        try {
          const freshUser = await authService.fetchProfile();
          setUser(freshUser);
        } catch (err) {
          // Only clear local session for real auth failures.
          // Network/CORS/API misconfig in production should not nuke localStorage.
          const status = axios.isAxiosError(err) ? err.response?.status : undefined;
          if (status === 401 || status === 403) {
            await authService.logout();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      // Redirect to profile-setup if profile is incomplete
      if (!response.user.profileComplete) {
        router.push('/profile-setup');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      router.push('/profile-setup');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/');
  };

  const getUser = (): User | null => {
    return authService.getCurrentUser();
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.fetchProfile();
      setUser(freshUser);
      return freshUser;
    } catch {
      return null;
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    getUser,
    refreshUser,
    isAuthenticated: !!user,
  };
}