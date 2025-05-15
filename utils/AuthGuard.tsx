'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRecordsStore } from '@/utils/stores/store';
import LoadingComp from '@/components/loading';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { verifyAuth } = useRecordsStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isPublicRoute = pathname === '/login' || pathname === '/testConnection';

    if (isPublicRoute) {
      setCheckingAuth(false);
      return;
    }

    const check = async () => {
      await verifyAuth();
      const user = useRecordsStore.getState().user;

      if (!user) {
        router.replace('/login');
      } else {
        setCheckingAuth(false);
      }
    };

    check();
  }, [pathname]);

  if (checkingAuth) return <LoadingComp />;

  return <>{children}</>;
}
