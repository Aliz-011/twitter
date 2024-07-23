'use server';

import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { hash, verify } from '@node-rs/argon2';

import { client } from '@/lib/database';
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
  UpdateUserFormValues,
  updateUserSchema,
} from '@/lib/validation';
import { lucia, validateRequest } from '../auth';
import { getUserDataSelect } from '@/types';

export const register = async (credentials: RegisterFormValues) => {
  try {
    const validatedFields = registerSchema.safeParse(credentials);

    if (!validatedFields.success) {
      return {
        error: 'Invalid credentials',
      };
    }

    const { username, email, password } = validatedFields.data;

    const hashed = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    console.log(hashed);
    const userId = generateIdFromEntropySize(10);
    console.log(userId);
    const existingUsername = await client.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (existingUsername) {
      return {
        error: 'Username already taken',
      };
    }

    const existingEmail = await client.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (existingEmail) {
      return {
        error: 'Email already taken',
      };
    }

    await client.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        password: hashed,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect('/');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
    return {
      error: 'Something went wrong. Please try again',
    };
  }
};

export const login = async (credentials: LoginFormValues) => {
  try {
    const validatedFields = loginSchema.safeParse(credentials);

    if (!validatedFields.success) {
      return {
        error: 'Invalid credentials',
      };
    }

    const { username, password } = validatedFields.data;

    const existingUser = await client.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!existingUser || !existingUser.password) {
      return {
        error: 'Incorrect username or password',
      };
    }

    const isMatch = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    console.log(isMatch);

    if (!isMatch) {
      return {
        erorr: 'Incorrect username or password',
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect('/');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: 'Something went wrong. Please try again',
    };
  }
};

export const logout = async () => {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error('Unauthorized');
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/sign-in');
};

export const updateUser = async (values: UpdateUserFormValues) => {
  const validatedFields = updateUserSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalidate fields');
  }

  const body = validatedFields.data;

  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const updateUser = await client.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...body,
    },
    select: getUserDataSelect(user.id),
  });

  return updateUser;
};
