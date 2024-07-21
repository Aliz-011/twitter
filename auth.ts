import { Lucia, Session, User } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { client } from '@/lib/database';

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const res = await lucia.validateSession(sessionId);

    try {
      if (res.session && res.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(res.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!res.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch (error) {}

    return res;
  }
);
