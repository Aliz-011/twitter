'use client';

import { HTTPError } from 'ky';
import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { UserTooltip } from '@/components/user-tooltip';

import { kyInstance } from '@/lib/ky';
import { UserData } from '@/types';

type Props = {
  children: React.ReactNode;
  username: string;
};

export const UserLinkWithTooltip = ({ children, username }: Props) => {
  const { data } = useQuery({
    queryKey: ['user-data', username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link href={`/${username}`} className="text-sky-500 hover:underline">
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link href={`/${username}`} className="text-sky-500 hover:underline">
        {children}
      </Link>
    </UserTooltip>
  );
};
