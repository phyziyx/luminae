import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
// import { v7 } from "uuid";
// import { sendEmail } from "@/lib/email";
import { admin, openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
    cookieCache: {
      enabled: true,
      maxAge: 10, // Cache duration in seconds
    },
  },
  verification: {
    modelName: "Verification",
  },
  plugins: [nextCookies(), admin(), openAPI()],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // requireEmailVerification: false,
    autoSignIn: true,
    // disableSignUp: false,
    // async sendResetPassword({ user, url }) {
    //   await sendEmail({
    //     to: user.email,
    //     subject: "Reset your password",
    //     text: `Click the link to reset your password: ${url}`,
    //   });
    // },
  },
  // emailVerification: {
  //   sendOnSignUp: false,
  //   autoSignInAfterVerification: false,
  //   async sendVerificationEmail({ user, token }) {
  //     const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
  //     await sendEmail({
  //       to: user.email,
  //       subject: "Verify your email address",
  //       text: `Click the link to verify your email: ${verificationUrl}`,
  //     });
  //   },
  // },
  advanced: {
    // generateId: () => {
    //   return v7();
    // },
    cookiePrefix: "luminae-",
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["email-password", "google"],
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // redirectURI: `/api/auth/callback/google`,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
