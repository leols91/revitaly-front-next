// src/auth/index.ts
import NextAuth from 'next-auth'
import appConfig from '@/configs/app.config'
import authConfig from '@/configs/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: appConfig.authenticatedEntryPath,
    error:   appConfig.authenticatedEntryPath,
  },
  secret: process.env.NEXTAUTH_SECRET,  // ← aqui
  ...authConfig,
})