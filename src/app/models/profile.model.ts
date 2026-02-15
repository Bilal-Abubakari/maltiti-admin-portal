/**
 * Profile-related models and types
 * Based on Swagger API documentation
 */

export interface ProfileResponseDto {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  userType: 'user' | 'admin' | 'superadmin';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
