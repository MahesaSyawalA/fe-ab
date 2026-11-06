export type UserRole = 'sales' | 'sales_manager' | 'director';

/** Bentuk lengkap termasuk `password_hash` — hanya untuk keperluan internal (auth). */
export interface User {
  id_user: string;
  id_squad: string | null;
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  password_hash: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Bentuk user yang boleh dikirim ke client — tanpa `password_hash`. */
export type PublicUser = Omit<User, 'password_hash'>;

export interface CreateUserInput {
  id_squad?: string | null;
  nama: string;
  role: UserRole;
  email: string;
  no_telp: string;
  /** Password polos dari client; di-hash di service sebelum disimpan. */
  password: string;
}

export interface UpdateUserInput {
  id_squad?: string | null;
  nama?: string;
  role?: UserRole;
  email?: string;
  no_telp?: string;
  /** Bila diisi, password akan di-hash ulang. */
  password?: string;
}

/** Bentuk yang benar-benar dikirim ke database. */
export interface CreateUserRecord extends Omit<CreateUserInput, 'password'> {
  password_hash: string;
}

export interface UpdateUserRecord extends Omit<UpdateUserInput, 'password'> {
  password_hash?: string;
}


/** Bentuk yang benar-benar dikirim ke database. */
export interface CreateUserRecord extends Omit<CreateUserInput, 'password'> {
  password_hash: string;
}

export interface UpdateUserRecord extends Omit<UpdateUserInput, 'password'> {
  password_hash?: string;
}