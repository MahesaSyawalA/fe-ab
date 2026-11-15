export type UserRole = 'sales' | 'sales_manager' | 'director' | 'admin';
export type UserSortBy = 'created_at' | 'nama' | 'role';

export interface User {
  id_user: string;
  id_squad: string | null;
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  password_hash: string;
  is_active: boolean;
  must_change_password: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export type PublicUser = Omit<User, 'password_hash'>;

export type PublicUserWithSquad = PublicUser & {
  squad?: {
    id_squad: string;
    nama_squad: string;
    wilayah?: string;
  } | null;
};

export interface CreateUserInput {
  id_squad?: string | null;
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  password: string;
  send_credentials?: boolean;
  must_change_password?: boolean;
}

export interface UpdateUserInput {
  id_squad?: string | null;
  nama?: string;
  role?: UserRole;
  email?: string;
  no_telp?: string;
  is_active?: boolean;
  password?: string;
}

export interface ResetPasswordInput {
  new_password: string;
  must_change_password?: boolean;
}

export interface CreateUserRecord
  extends Omit<CreateUserInput, 'password' | 'send_credentials' | 'must_change_password'> {
  password_hash: string;
}

export interface UpdateUserRecord extends Omit<UpdateUserInput, 'password'> {
  password_hash?: string;
}
