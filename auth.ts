import { isAxiosError } from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { api } from '@/lib/axios';
import { type UserRole } from '@/types/user.types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const resJson = response.data;
          const userObj = resJson?.data;

          if (!userObj || !userObj.id_user) {
            return null;
          }

          const rawHeader = response.headers['set-cookie'];
          const rawCookies: string[] = Array.isArray(rawHeader)
            ? rawHeader
            : typeof rawHeader === 'string'
              ? [rawHeader]
              : [];

          let extractedAccessToken = '';
          let extractedRefreshToken = '';

          for (const cookieStr of rawCookies) {
            if (cookieStr.includes('access_token=') || cookieStr.includes('accessToken=')) {
              const match = cookieStr.match(/(?:access_token|accessToken)=([^;]+)/);
              if (match) extractedAccessToken = match[1];
            }
            if (cookieStr.includes('refresh_token=') || cookieStr.includes('refreshToken=')) {
              const match = cookieStr.match(/(?:refresh_token|refreshToken)=([^;]+)/);
              if (match) extractedRefreshToken = match[1];
            }
          }

          const accessToken =
            extractedAccessToken ||
            resJson?.accessToken ||
            resJson?.token ||
            userObj.accessToken ||
            `cookie-session-${userObj.id_user}-${Date.now()}`;

          const refreshToken =
            extractedRefreshToken ||
            resJson?.refreshToken ||
            userObj.refreshToken ||
            undefined;

          return {
            id: String(userObj.id_user),
            id_user: String(userObj.id_user),
            name: String(userObj.nama),
            nama: String(userObj.nama),
            email: String(userObj.email),
            role: userObj.role as UserRole,
            id_squad: userObj.id_squad ?? null,
            no_telp: userObj.no_telp ? String(userObj.no_telp) : undefined,
            is_active:
              typeof userObj.is_active === 'boolean' ? userObj.is_active : undefined,
            must_change_password:
              typeof userObj.must_change_password === 'boolean'
                ? userObj.must_change_password
                : undefined,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          // Tanpa log ini, semua kegagalan (429, jaringan, URL salah) tampil sebagai CredentialsSignin.
          console.error(
            '[authorize] login ke BE gagal:',
            isAxiosError(error)
              ? `${error.response?.status ?? 'no-response'} ${error.code ?? ''} ${error.message}`
              : error,
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id_user = user.id_user;
        token.nama = user.nama;
        token.role = user.role;
        token.id_squad = user.id_squad;
        token.no_telp = user.no_telp;
        token.is_active = user.is_active;
        token.must_change_password = user.must_change_password;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      if (trigger === 'update' && session) {
        if (session.user?.nama || session.user?.name) {
          token.nama = session.user.nama || session.user.name;
        }
        if (session.user?.no_telp) {
          token.no_telp = session.user.no_telp;
        }
        if (typeof session.user?.is_active === 'boolean') {
          token.is_active = session.user.is_active;
        }
        if (typeof session.user?.must_change_password === 'boolean') {
          token.must_change_password = session.user.must_change_password;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id_user,
          id_user: token.id_user,
          name: token.nama || session.user?.name || '',
          nama: token.nama || session.user?.name || '',
          email: token.email || session.user?.email || '',
          role: token.role,
          id_squad: token.id_squad,
          no_telp: token.no_telp,
          is_active: token.is_active,
          must_change_password: token.must_change_password,
        };
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
