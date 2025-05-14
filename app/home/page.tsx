'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Navbar from '@/components/nav/navbar';
import Sidebar from '@/components/nav/sidebar';
import MainContent from '@/components/mainContent';
import { useRecordsStore } from '@/utils/stores/store';

export default function Home() {
  const { selectedMenu, setTableid } = useRecordsStore();

  useEffect(() => {
    if (selectedMenu) {
      setTableid(selectedMenu);
    }
  }, [selectedMenu]);

  return (
    <div className="w-full h-screen flex">
      <Toaster richColors position="top-right" />
      <div className="h-screen bg-gray-800 text-white">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="w-full bg-white shadow-md">
          <Navbar />
        </div>
        <div className="flex-1 bg-gray-100 p-4 h-5/6">
          { selectedMenu === '' ? (
            <div></div>
          ) : (
            <MainContent tableid={selectedMenu} />
          )}
        </div>
      </div>
    </div>
  );
}
