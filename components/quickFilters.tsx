import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from './genericComponent';
import { AppContext } from '@/context/appContext';
import { useRecordsStore } from '@/utils/stores/recordsStore';
import axiosInstance from '@/utils/axiosInstance';
import { set } from 'lodash';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// FLAG PER LO SVILUPPO
const isDev = false;

// INTERFACCE
        // INTERFACCIA PROPS
        interface PropsInterface {
          propExampleValue?: string;
        }

        // INTERFACCIA RISPOSTA DAL BACKEND
        interface ResponseInterface {
          views: {
            id: number;
            name: string;
          }[];
        }

export default function QuickFilters({ propExampleValue }: PropsInterface) {
    //DATI
            // DATI PROPS PER LO SVILUPPO
            const devPropExampleValue = isDev ? "Example prop" : propExampleValue;

            // DATI RESPONSE DI DEFAULT
            const responseDataDEFAULT: ResponseInterface = {
                views: []
              };

            // DATI RESPONSE PER LO SVILUPPO 
            const responseDataDEV: ResponseInterface = {
              views: [
                {
                  id: 1,
                  name: 'view1'
                },
                {
                  id: 2,
                  name: 'view2'
                },
                {
                  id: 3,
                  name: 'view3'
                }
              ]
            };

            // DATI DEL CONTESTO
            const { user } = useContext(AppContext);

            const [inputValue, setInputValue] = useState('');
            const [selectedView, setSelectedView] = useState(1);

            const {setSearchTerm,setTableView, isFiltersOpen, setIsFiltersOpen} = useRecordsStore();
            const {refreshTable,setRefreshTable,selectedMenu} = useRecordsStore();

            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const keyword = e.target.value;
              setInputValue(keyword); // Aggiorna stato locale
              setSearchTerm(keyword); // Passa il valore al componente genitore
            };

            const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
              const viewid = e.target.value;
              setSelectedView(parseInt(viewid)); // Aggiorna stato locale
              setTableView(viewid); // Passa il valore al componente genitore
              researchTableSubmit();  
            }

            const researchTableSubmit = () => {
              setRefreshTable(refreshTable + 1);
            }

    // IMPOSTAZIONE DELLA RESPONSE (non toccare)
    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);


    // PAYLOAD (solo se non in sviluppo)
    const payload = useMemo(() => {
        if (isDev) return null;
        return {
            apiRoute: 'get_table_views', // riferimento api per il backend
            tableid: selectedMenu, 
        };
    }, [propExampleValue]);

    // CHIAMATA AL BACKEND (solo se non in sviluppo) (non toccare)
    const { response, loading, error } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null };

    // AGGIORNAMENTO RESPONSE CON I DATI DEL BACKEND (solo se non in sviluppo) (non)
    useEffect(() => {
        setInputValue(''); // Resetta il valore di input quando cambia la risposta
        setSearchTerm(inputValue); // Passa il valore al componente genitore
        setTableView(selectedView.toString());
        if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
            setResponseData(response);
            setSelectedView(response.views[0].id);
        }
    }, [response, responseData, selectedView, selectedMenu]);

    return (
        <GenericComponent response={responseData} loading={loading} error={error} title="recordFilters" > 
            {(response: ResponseInterface) => (
                <div className="flex items-center justify-between w-full gap-3">
                {/* Form con select e search */}
                <form className="flex items-center gap-3 w-full" onSubmit={(e) => { e.preventDefault(); researchTableSubmit(); }}>
                  <select 
                    id="filter-type"
                    value={selectedView}
                    className="w-1/2 h-10 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-gray-500 focus:border-gray-500 px-4 shadow-sm hover:border-gray-300 transition-all duration-200 outline-none"
                    onChange={handleViewChange}
                  >
                    {response.views.map((view) => (
                      <option key={view.id} value={view.id}>{view.name}</option>
                    ))}
                  </select>
              
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input 
                      type="search"
                      id="default-search" 
                      className="block w-full h-10 ps-10 text-sm text-gray-700 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500 shadow-sm hover:border-gray-300 transition-all duration-200 outline-none" 
                      placeholder="Cerca" 
                      value={inputValue} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </form>
              
              
              </div>
            )}
        </GenericComponent>
    );
};