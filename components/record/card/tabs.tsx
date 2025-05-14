import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../../genericComponent';
import { AppContext } from '@/context/appContext';
import CardFields from './fields';
import CardLinked from './linked';

const isDev = false;

        interface PropsInterface {
          tableid: string;
          recordid: string;
          mastertableid?: string;
          masterrecordid?: string;
        }

        interface ResponseInterface {
            cardTabs: []
            activeTab: string;
        }

export default function CardTabs({ tableid,recordid,mastertableid, masterrecordid }: PropsInterface) {

            const responseDataDEFAULT: ResponseInterface = {
                cardTabs: [], 
                activeTab: 'Campi'
              };

            const responseDataDEV: ResponseInterface = {
                cardTabs: [],
                activeTab: 'Campi'
            };

    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

    const payload = useMemo(() => {
        if (isDev) return null;
        return {
            apiRoute: 'get_card_active_tab',
            tableid: tableid
        };
    }, [tableid, recordid]);

    const [activeTab, setActiveTab] = useState<string>('Campi');


    const { response, loading, error } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null };

    useEffect(() => {
        if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
            setResponseData(response);
            setActiveTab(response.activeTab);
        }
    }, [response]);


    return (
      <GenericComponent> 
      {(data) => (
          <div className="h-full">
          <div className="h-min text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px relative">
              {responseData.cardTabs.map((tab, index) => (
                <li key={index} className="me-2">
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${
                      activeTab === tab
                        ? 'text-red-500 border-red-500 hover:text-red-600 hover:border-red-300'
                        : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>            
          <div className="h-5/6 p-4">
            {activeTab === 'Campi' && (
              <CardFields tableid={tableid} recordid={recordid}  mastertableid={mastertableid} masterrecordid={masterrecordid}/>
            )}
            {activeTab === 'Collegati' && (
              <CardLinked tableid={tableid} recordid={recordid} />
            )}
          </div>
        </div>
      )}
    </GenericComponent>
    );
};



