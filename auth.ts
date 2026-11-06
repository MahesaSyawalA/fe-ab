import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
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

        const email = String(credentials.email).toLowerCase();

        // Mock kredensial adaptif per-role berdasarkan email untuk testing/development
        let role: UserRole = 'sales';
        let nama = 'Sales Representative';
        let id_squad: string | null = 'sq-1';

        if (email.includes('manager')) {
          role = 'sales_manager';
          nama = 'Sales Manager';
          id_squad = 'sq-1';
        } else if (email.includes('director') || email.includes('direktur')) {
          role = 'director';
          nama = 'Direktur Utama';
          id_squad = null;
        }

        return {
          id: 'usr-1',
          id_user: 'usr-1',
          name: nama,
          nama,
          email,
          role,
          id_squad,
          accessToken: `mock-access-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id_user = user.id_user;
        token.nama = user.nama;
        token.role = user.role;
        token.id_squad = user.id_squad;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id_user,
          id_user: token.id_user,
          nama: token.nama || session.user?.name || '',
          email: token.email || session.user?.email || '',
          role: token.role,
          id_squad: token.id_squad,
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
