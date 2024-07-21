'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { RegisterFormValues, registerSchema } from '@/lib/validation';
import { register } from '@/actions/user.actions';

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    startTransition(async () => {
      const { error } = await register(values);
      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Account created!');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="shadcn"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin size-4 mr-2" />
              Creating...
            </>
          ) : (
            'Create account'
          )}
        </Button>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          disabled={isPending}
        >
          Login with Google
        </Button>
      </form>
    </Form>
  );
};
