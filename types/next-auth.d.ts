import { type DefaultSession } from 'next-auth';
import { type UserRole } from './user.types';

export interface AuthUser {
  id_user: string;
  nama: string;
  email: string;
  role: UserRole;
  id_squad: string | null;
  no_telp?: string;
}

declare module 'next-auth' {
  interface User {
    id_user: string;
    nama: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session {
    user: AuthUser & DefaultSession['user'];
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id_user: string;
    nama?: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    accessToken: string;
    refreshToken?: string;
  }
}

declare module '@auth/core/types' {
  interface User {
    id_user: string;
    nama: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    accessToken: string;
    refreshToken?: string;
  }

  interface Session {
    user: AuthUser & DefaultSession['user'];
    accessToken: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id_user: string;
    nama?: string;
    role: UserRole;
    id_squad: string | null;
    no_telp?: string;
    accessToken: string;
    refreshToken?: string;
  }
}
