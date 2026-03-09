import { User } from '@prisma/client';

export function formatUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
    usernameChangedAt: user.usernameChangedAt?.toISOString() || null,
    dateOfBirth: user.dateOfBirth?.toISOString() || null,
    bio: user.bio,
    gender: user.gender,
    profileImageUrl: user.profileImageUrl,
    phoneNumber: user.phoneNumber,
    profileComplete: user.profileComplete,
    createdAt: user.createdAt.toISOString(),
  };
}
