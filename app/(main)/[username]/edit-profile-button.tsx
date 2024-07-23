'use client';

import { useState } from 'react';

import { UserData } from '@/types';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from './edit-profile-dialog';

type Props = {
  user: UserData;
};

export const EditProfileButton = ({ user }: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog((prev) => !prev)}
        className="rounded-full"
        size="sm"
      >
        Edit Profile
      </Button>
      <EditProfileDialog
        open={showDialog}
        onChange={setShowDialog}
        user={user}
      />
    </>
  );
};