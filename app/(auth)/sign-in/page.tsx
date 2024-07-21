import Link from 'next/link';
import { SignInForm } from './form';

export const metadata = {
  title: 'Sign up',
};

const SignInPage = () => {
  return (
    <main className="flex h-full items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            A place where you can find a friends
          </p>
        </div>

        <SignInForm />

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
