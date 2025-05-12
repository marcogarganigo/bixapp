'use client';

import React, { createContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingComp from '@/components/loading';
import { useRecordsStore } from '@/utils/stores/recordsStore';

interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  chat: string | null;
  setChat: (chat: string | null) => void;
  telefono: string | null;
  setTelefono: (tel: string | null) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  handleLogout: () => Promise<void>;
  activeServer: string | null;
  setActiveServer: (server: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  role: null,
  setRole: () => {},
  chat: null,
  setChat: () => {},
  telefono: null,
  setTelefono: () => {},
  userName: null,
  setUserName: () => {},
  handleLogout: async () => {},
  activeServer: null,
  setActiveServer: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    user,
    setUser,
    role,
    setRole,
    chat,
    setChat,
    telefono,
    setTelefono,
    userName,
    setUserName,
    activeServer,
    setActiveServer,
    handleLogout,
    verifyAuth,
    loadingAuth,
    setLoadingAuth,
  } = useRecordsStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLoginOrTest = pathname === '/login' || pathname === '/testConnection';
    if (isLoginOrTest) {
      setLoadingAuth(false);
      return;
    }

    async function check() {
      await verifyAuth();
      const isAuthed = useRecordsStore.getState().user;
      if (!isAuthed) router.push('/login');
    }

    check();
  }, [pathname]);

  if (loadingAuth) {
    return <LoadingComp />;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        chat,
        setChat,
        telefono,
        setTelefono,
        userName,
        setUserName,
        handleLogout,
        activeServer,
        setActiveServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
