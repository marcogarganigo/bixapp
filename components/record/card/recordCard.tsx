import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useRecordsStore } from '@/utils/stores/recordsStore';
import { CircleX, Maximize2, Info, Trash2, Check } from 'lucide-react';
import CardBadge from './cardBadge';
import CardTabs from './cardTabs';
import { toast, Toaster } from 'sonner';
import axiosInstance from '@/utils/axiosInstance'
import axiosInstanceClient from '@/utils/axiosInstanceClient';
import { AppContext } from '@/context/appContext';

// INTERFACCIA PROPS
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

  const { removeCard, cardsList, setIsPopupOpen, setPopUpType, setPopupRecordId } = useRecordsStore();
  const {activeServer} = useContext(AppContext);
  const [animationClass, setAnimationClass] = useState('animate-mobile-slide-in'); 
  const [isMaximized, setIsMaximized] = useState(false);
  const [mountedTime, setMountedTime] = useState<string>("");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  // Stato per il menu a tendina
  const [showDropdown, setShowDropdown] = useState(false);

  // Modifica getOffset per una migliore visualizzazione mobile
  const getOffset = () => {
    if (isMaximized) return 0;
    // Offset ridotto per mobile, più adatto per schermi piccoli
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
            )
            handleRemoveCard();
            toast.success('Record eliminato con successo');
        } catch (error) {
            console.error('Errore durante l\'eliminazione del record', error);
            toast.error('Errore durante l\'eliminazione del record');
        }
    }

  const getEmailReady = () => {
    setIsPopupOpen(true);
  };

  const stampaBollettino = async () => {
    try {
      const response = await axiosInstanceClient.post(
        "/postApi",
        {
          apiRoute: "stampa_bollettino",
          recordid: recordid,
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const contentDisposition = response.headers['content-disposition'] || '';
      let filename = 'bollettino-standard.pdf';

      const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      }
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      toast.success('Bollettino stampato con successo');

    } catch (error) {
      console.error('Errore durante la stampa del bollettino', error);
      toast.error('Errore durante la stampa del bollettino');
    }
  }

  const sendEmail = async () => {
    try {
      const response = await axiosInstanceClient.post(
        "/postApi",
        {
          apiRoute: "send_emails",
          recordid: recordid,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success('Email inviata con successo');
    } catch (error) {
      console.error("Errore durante l'invio della email", error);
      toast.error("Errore durante l'invio della email");
    }
  }

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
  
  useEffect(() => {
        const now = performance.now();
        const minutes = Math.floor(now / 60000);
        const seconds = Math.floor((now % 60000) / 1000);
        const centiseconds = Math.floor((now % 1000) / 10);
        setMountedTime(`${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`);
    }, []);

  return (
    <div
      className={`fixed inset-x-0 mx-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-gray-50 rounded-xl border-2 border-gray-50 p-3 ${animationClass} ${
          isMaximized ? 'w-full h-full max-w-5xl' : 'w-11/12 h-5/6 max-w-4xl'
      } transition-all duration-300`}
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
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors hover:scale-110 transition-all duration-100 ease-in-out" 
              onClick={handleRemoveCard}
              title="Chiudi"
            >
              <CircleX className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeServer !== 'belotti' && (
              <>
                {/* Dropdown menu */}
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

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-30">
                      <ul className="py-1">
                        {tableid === 'bollettini' && (
                          <li 
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              toast.info('Stampa bollettino in corso...');
                              stampaBollettino();
                              setShowDropdown(false);
                            }}
                          >
                            Stampa bollettino
                          </li>
                        )}
                        {tableid === 'email' && (
                          <li 
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              toast.info('Invio email in corso...');
                              sendEmail();
                            }}
                          >
                            Invia email
                          </li>
                        )}
                        {tableid === 'rendicontolavanderia' && (
                          <li 
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setPopupRecordId(recordid);
                              setIsPopupOpen(true);
                              setPopUpType('emailLavanderia');
                              setShowDropdown(false);
                            }}
                          >
                            Invia rendiconto
                          </li>
                        )}
                        {tableid === 'stabile' && (
                          <li 
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setPopupRecordId(recordid);
                              setIsPopupOpen(true);
                              setPopUpType('reportGasolio');
                              setShowDropdown(false);
                            }}
                          >
                            Report gasolio
                          </li>
                        )}
                        {tableid === 'bollettinitrasporto' && (
                          <li 
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setPopupRecordId(recordid);
                              setIsPopupOpen(true);
                              setPopUpType('emailBollettini');
                              setShowDropdown(false);
                            }}
                          >
                            Invia email
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>


                <button 
                  className="p-1.5 rounded-full hover:bg-red-100 transition-colors hover:scale-110 transition-all duration-100 ease-in-out" 
                  onClick={handleTrashClick}
                  title="Elimina"
                >
                  <Trash2 className="w-5 h-5 text-primary hover:text-red-500" />
                </button>
              </>
            )}

            
          </div>
        </div>

        <div className="h-5/6">
          <CardBadge tableid={tableid} recordid={recordid} />
        </div>
      </div>
          
      <div className="h-full w-full">
        <CardTabs tableid={tableid} recordid={recordid} mastertableid={mastertableid} masterrecordid={masterrecordid}></CardTabs>
      </div>
    </div>
  );
};