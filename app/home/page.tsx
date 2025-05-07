'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth, logoutUser } from '@/utils/auth';
import { Toaster, toast } from 'sonner';
import Navbar from '@/components/nav/navbar';
import { getCsrfToken } from '@/utils/auth';
import SidebarMenu from '@/components/nav/sidebar';
//import StandardContent from '@/components/standardContent';
import { useRecordsStore } from '@/utils/stores/recordsStore';
//import Dashboard from '@/components/dashboard';
import { set } from 'lodash';
//import SimplePopup from '@/components/inviaEmail';
//import PopUpManager from '@/components/popUpManager';
//import UserSettings from '@/components/userSettings';

export default function Home() {
  const {selectedMenu, setTableid, isPopupOpen, setIsPopupOpen, popUpType, popupRecordId} = useRecordsStore();
  const router = useRouter();

  useEffect(() => {
    if (selectedMenu) {
      setTableid(selectedMenu);
    }
  }, [selectedMenu]);

  return (    
   <div className="w-full h-screen flex">
    
      <Toaster richColors position="top-right" />
      
      {/* Sidebar occupa tutta l'altezza */}
      <SidebarMenu className="h-screen  bg-gray-800 text-white" />

      {/* Contenitore principale con Navbar e contenuto */}
      <div className="flex flex-col w-full h-full">
         {/* Contenitore principale con Navbar e contenuto */}
        <Navbar className="w-full  bg-white shadow-md" />

        {/* Contenuto principale */}

        {/*<PopUpManager 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
          type={popUpType}
          tableid={selectedMenu}
          recordid={popupRecordId}
        />*/}

        <div className="flex-1 bg-gray-100 p-4 h-5/6">
          
            {/*
            <StandardContent tableid={selectedMenu} />
            */}
          
        </div>
      </div>
    </div>
  );
}
