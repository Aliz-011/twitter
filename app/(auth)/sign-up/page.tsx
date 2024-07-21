import Link from 'next/link';
import { SignUpForm } from './form';

export const metadata = {
  title: 'Sign up',
};

const SignUpPage = () => {
  return (
    <main className="flex h-full items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign up</h1>
          <p className="text-muted-foreground">
            A place where you can find a friends
          </p>
        </div>

        <SignUpForm />

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
