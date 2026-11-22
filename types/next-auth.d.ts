import { type DefaultSession } from 'next-auth';
import { type UserRole } from './user.types';

export interface AuthUser {
  id_user: string;
  nama: string;
  email: string;
  role: UserRole;
  id_squad: string | null;
  no_telp?: string;
  is_active?: boolean;
  must_change_password?: boolean;
}

declare module 'next-auth' {
  interface User {
    id_user: string;
    nama: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    is_active?: boolean;
    must_change_password?: boolean;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session {
    user: AuthUser & DefaultSession['user'];
    accessToken: string;
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id_user: string;
    nama?: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    is_active?: boolean;
    must_change_password?: boolean;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: 'RefreshTokenError';
  }
}

declare module '@auth/core/types' {
  interface User {
    id_user: string;
    nama: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    is_active?: boolean;
    must_change_password?: boolean;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session {
    user: AuthUser & DefaultSession['user'];
    accessToken: string;
    error?: 'RefreshTokenError';
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id_user: string;
    nama?: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    is_active?: boolean;
    must_change_password?: boolean;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: 'RefreshTokenError';
  }
}
