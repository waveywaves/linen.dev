import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from 'client';
import { CustomPrismaAdapter } from 'lib/auth';
import SignInMailer from 'mailers/SignInMailer';
import { NOREPLY_EMAIL } from 'secrets';
import CredentialsProvider from 'next-auth/providers/credentials';
import UsersService from 'services/users';

export const authOptions = {
  pages: {
    signIn: '/signin',
    error: '/signin',
    verifyRequest: '/verify-request',
  },
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: `Linen.dev <${NOREPLY_EMAIL}>`,

      async sendVerificationRequest(params) {
        try {
          const { identifier, url } = params;

          const result = await SignInMailer.send({
            to: identifier,
            url,
          });

          const failed = result?.rejected
            ?.concat(result.pending)
            .filter(Boolean);
          if (failed && failed.length) {
            throw new Error(
              `Email(s) (${failed.join(', ')}) could not be sent`
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;
        return UsersService.authorize(email, password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, isNewUser, profile, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.user.id = token.id;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 5 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET as string,
} as NextAuthOptions;

export default NextAuth(authOptions);
