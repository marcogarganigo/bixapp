import React, { useState, useContext } from 'react';
import { useRecordsStore } from '@/utils/stores/store';
import { CircleX, Trash2 } from 'lucide-react';
import CardTabs from './tabs';
import { toast } from 'sonner';
import axiosInstanceClient from '@/utils/axiosInstanceClient';

interface PropsInterface {
  tableid: string;
  recordid: string;
  mastertableid?: string;
  masterrecordid?: string;
  type: string;
  index?: number;
  total?: number;	
}

export default function RecordCard({ tableid, recordid, mastertableid, masterrecordid, type, index=0, total=1 }: PropsInterface) {
  const { removeCard, refreshTable, setRefreshTable } = useRecordsStore();
  const [animationClass, setAnimationClass] = useState('animate-mobile-slide-in'); 
  const [showDropdown, setShowDropdown] = useState(false);

  const getOffset = () => {
    const baseOffset = window.innerWidth < 768 ? 10 : 20; 
    return (total - index - 1) * baseOffset;
  };

  const handleRemoveCard = () => {
    setAnimationClass('animate-mobile-slide-out');
    setTimeout(() => {
      removeCard(tableid, recordid);
    }, 300);
  };

  const deleteRecord = async () => {
    try {
      const response = await axiosInstanceClient.post(
        "/postApi",
        {
          apiRoute: "delete_record",
          tableid: tableid,
          recordid: recordid,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      handleRemoveCard();
      toast.success('Record eliminato con successo');
      removeCard(tableid, recordid);
      setRefreshTable(refreshTable+1);
    } catch (error) {
      console.error('Errore durante l\'eliminazione del record', error);
      toast.error('Errore durante l\'eliminazione del record');
    }
  };

  const handleTrashClick = () => {
    toast.warning(
      "Sei sicuro di voler eliminare questo record?", 
      {
        action: {
          label: "Conferma",
          onClick: () => deleteRecord(),
        },
      }
    );
  };

  return (
    <div
      className={`fixed inset-x-0 mx-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-50 rounded-xl border-2 border-gray-50 p-3 ${animationClass} ${'w-11/12 h-5/6 max-w-4xl'} transition-all duration-300`}
      style={{
        right: `${getOffset() + 0}px`,
        marginTop: `${getOffset() + 0}px`,
        zIndex: 50 + index
      }}
    >
      <div className="h-min w-full">
        <div className="h-1/6 w-full flex justify-between items-center px-4">
          <div className="flex-grow">
            <button 
              className="p-1.5 rounded-full hover:bg-gray-100 hover:scale-110 transition-all duration-100 ease-in-out" 
              onClick={handleRemoveCard}
              title="Chiudi"
            >
              <CircleX className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-2">
                <div className="relative">
                  <button 
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 
                              font-medium rounded-md text-xs px-3 py-1.5 text-center inline-flex items-center 
                              dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" 
                    type="button" 
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    Funzioni
                    <svg className="w-2 h-2 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>  
                </div>

                <button 
                  className="p-1.5 rounded-full hover:bg-red-100 hover:scale-110 transition-all duration-100 ease-in-out" 
                  onClick={handleTrashClick}
                  title="Elimina"
                >
                  <Trash2 className="w-5 h-5 text-primary hover:text-red-500" />
                </button>
          </div>
        </div>
      </div>
      <div className="h-full w-full">
        <CardTabs tableid={tableid} recordid={recordid} mastertableid={mastertableid} masterrecordid={masterrecordid}></CardTabs>
      </div>
    </div>
  );
}