'use client';

import { Session, User } from 'lucia';
import { createContext } from 'react';

interface ISessionContext {
  user: User;
  session: Session;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ISessionContext;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
