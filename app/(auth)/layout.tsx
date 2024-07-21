import { validateRequest } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: Props) => {
  const { session } = await validateRequest();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {children}
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://imageplaceholder.net/1920x1080/eeeeee/131313?text=Twitter&tag=Summer+beach"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
