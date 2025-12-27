export enum Role {
  Admin = 'admin',
  User = 'user',
  SuperAdmin = 'superadmin',
}

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: Role;
  phoneNumber?: string;
  permissions?: string;
  mustChangePassword: boolean;
  rememberToken?: string;
  avatarUrl?: string;
  status: Status;
  dob?: string;
  createdAt: string;
  emailVerifiedAt?: string;
  updatedAt: string;
}
