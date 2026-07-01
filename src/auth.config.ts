import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import z, { object } from 'zod';
import { prisma } from './lib/prisma';
import bcryptjs from 'bcryptjs';

export const authConfig : NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.data = user;
            }

            return token;
        },  

        async session({session, token}) {
            console.log({ session, token });
            session.user = token.data as any;
            // validar si el usuario esta activo en la base de datos aqui
            return session;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                
                if(!parsedCredentials.success) return null
                
                const { email, password } = parsedCredentials.data;           

                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

                if (!user) return null;                

                if (!bcryptjs.compareSync(password, user.password)) return null;     
                
                const { password: _, ...rest } = user; 

                return rest;
            }
        })
    ]
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);