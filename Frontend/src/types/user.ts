export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  username?: string;
  usernameChangedAt?: string;
  dateOfBirth?: string;
  bio?: string;
  gender?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  profileComplete?: boolean;
  role: Role;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface UpdateProfileData {
  username: string;
  dateOfBirth: string;
  bio: string;
  gender: string;
  profileImageUrl: string;
  phoneNumber: string;
}

export interface EditProfileData {
  username?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
}