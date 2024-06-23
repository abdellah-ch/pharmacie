// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
// import { NextApiRequest, NextApiResponse } from 'next';

const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: 'User ID', type: 'text', placeholder: '123456' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { userId: credentials.userId },
        });
        if (user && user.password === credentials.password) {
          return { id: user.id.toString(), name: user.uername, email: user.email }; // Ensure the user object matches the expected type
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, user }: { session: any, user: any }) {
      session.user = user;
      return session;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export { handler as GET, handler as POST };

async function handler(req: any, res: any) {
  return NextAuth(req, res, options);
}
