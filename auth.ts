import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // TODO: replace this with axios to hit the login API later
                console.log('Credentials masuk:', credentials);

                // mocking temporary so the form doesn't error when submitted
                // this will be deleted when integrated with BE
                if (credentials?.email && credentials?.password) {
                    return { id: '1', name: 'User Test', email: credentials.email as string, accessToken: 'token-sementara-123' };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // if user is newly logged in, insert the token from the backend into the JWT NextAuth
            if (user) {
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            // pass the token to the session object so that it can be accessed in the client
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});