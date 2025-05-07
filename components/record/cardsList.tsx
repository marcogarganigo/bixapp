import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../genericComponent';
import { AppContext } from '@/context/appContext';
import { useRecordsStore } from '@/utils/stores/recordsStore';
import { ArrowUp, ArrowDown, Maximize2 } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { set } from 'lodash';




const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// FLAG PER LO SVILUPPO
const isDev = false;

// INTERFACCE
        // INTERFACCIA PROPS
        interface PropsInterface {
          tableid?: string;
          searchTerm?: string;
          filters?: string;
          view?: string;
          order?: string[];
          context?: string;
          pagination: {
            page: number;
            limit: number;
          }
          level?: number;
          masterTableid?: string;
          masterRecordid?: string;
        }

        // INTERFACCIA RISPOSTA DAL BACKEND
        interface ResponseInterface {
            rows: Array<{
                recordid: string;
                css: string;
                fields: Array<{
                    recordid?: string;
                    css: string;
                    type: string;
                    value: string;
                    fieldid: string;
                }>
            }>;
            columns: Array<{    
                fieldtypeid: string;
                desc: string;
            }>;
        }

// TIPO DI ORDINAMENTO
type SortDirection = 'asc' | 'desc' | null;

export default function CardsList({ tableid, searchTerm, filters, view, order, context, pagination, level, masterTableid, masterRecordid }: PropsInterface) {

    useEffect(() => {
        const unsub = useRecordsStore.subscribe((state, prevState) => {
          console.log('[zustand]', { prev: prevState, next: state });
        });
        return unsub;   // pulizia
      }, []);

    //DATI
            // DATI PROPS PER LO SVILUPPO
            const devPropExampleValue = isDev ? "Example prop" : tableid + ' ' + searchTerm + ' ' + filters + ' ' + context;

            // DATI RESPONSE DI DEFAULT
            const responseDataDEFAULT: ResponseInterface = {
                rows: [],
                columns: []
              };

            // DATI RESPONSE PER LO SVILUPPO 
            const responseDataDEV: ResponseInterface = {
                rows: [
                    {
                        recordid: "1",
                        css: "#",
                        fields: [
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "macbook",
                                fieldid: "1"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "nero",
                                fieldid: "2"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "Laptop",
                                fieldid: "3"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "2k",
                                fieldid: "4"
                            },
                        ]
                    },
                    {
                        recordid: "2",
                        css: "#",
                        fields: [
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "surface",
                                fieldid: "1"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "bianco",
                                fieldid: "2"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "Laptop",
                                fieldid: "3"
                            },
                            {
                                recordid: "",
                                css: "",
                                type: "standard",
                                value: "1k",
                                fieldid: "4"
                            },
                        ]
                    },
                ],
                columns: [
                    {
                        fieldtypeid: "Numero",
                        desc: 'Product name'
                    },
                    {
                        fieldtypeid: "Numero",
                        desc: 'Color'
                    },
                    {
                        fieldtypeid: "Numero",
                        desc: 'Type'
                    },
                    {
                        fieldtypeid: "Numero",
                        desc: 'Price'
                    },
                ],
              };

            // DATI DEL CONTESTO
            const { user } = useContext(AppContext);

    // IMPOSTAZIONE DELLA RESPONSE (non toccare)
    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);
    const [cardLevel, setCardLevel] = useState<number>(0);

    // STATO PER L'ORDINAMENTO (solo parte grafica)
    const [sortConfig, setSortConfig] = useState<{
        columnDesc: string | null;
        direction: SortDirection;
    }>({
        columnDesc: null,
        direction: null
    });

    // ✅ un selector per chiave
    const refreshTable    = useRecordsStore(s => s.refreshTable);
    const setRefreshTable = useRecordsStore(s => s.setRefreshTable);
    const handleRowClick  = useRecordsStore(s => s.handleRowClick);
    const setCurrentPage  = useRecordsStore(s => s.setCurrentPage);


    // PAYLOAD (solo se non in sviluppo)
    const payload = useMemo(() => {
        if (isDev) return null;
        return {
            apiRoute: 'get_table_records', // riferimento api per il backend
            tableid: tableid,
            searchTerm: searchTerm,
            view: view,
            currentPage: pagination.page,
            masterTableid: masterTableid,
            masterRecordid: masterRecordid
        };
    }, [refreshTable, tableid, searchTerm, view, pagination.page, masterTableid, masterRecordid]);


    // CHIAMATA AL BACKEND (solo se non in sviluppo) (non toccare)
    const { response, loading, error, elapsedTime } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null, elapsedTime:null };

    // AGGIORNAMENTO RESPONSE CON I DATI DEL BACKEND (solo se non in sviluppo) (non toccare)
    useEffect(() => {
        if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
            setResponseData(response);
        }
    }, [response, responseData]);

    // FUNZIONE PER GESTIRE IL CLICK SULL'INTESTAZIONE DELLA COLONNA (solo parte grafica)
    const handleSort = (columnDesc: string) => {
        let direction: SortDirection = 'asc';
        
        if (sortConfig.columnDesc === columnDesc) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = null;
            }
        }
        
        setSortConfig({
            columnDesc: direction === null ? null : columnDesc,
            direction
        });
        
        // Qui in futuro potresti aggiungere la chiamata al backend per il vero ordinamento
        console.log(`Ordinamento colonna ${columnDesc} in direzione ${direction}`);
        setOrderColumn(columnDesc, direction);
    };


    const setOrderColumn = async (columnDesc: string, direction: SortDirection ) => {
        
    }

    const setTablePage = async (page: number) => {
        if (page < 1) {
            page = 1;
        }
        if (page > pagination.limit) {
            page = pagination.limit;
        }
        setCurrentPage(page);       
        setRefreshTable(refreshTable + 1); 
    }

    console.log('[DEBUG] RecordsTable');
    useEffect(() => {
        console.log('[DEBUG] payload changed', payload);
      }, [payload]);
      
      useEffect(() => {
        console.log('[DEBUG] RecordsTable rendered');
      });
    return (
        <GenericComponent response={responseData} loading={loading} error={error} title='recordsTable' elapsedTime={elapsedTime}> 
            {(response: ResponseInterface) => (
                <div className="h-full w-full overflow-scroll">
                    
                    <div className="w-full h-full relative rounded-lg drop-shadow-md ">
                        {/* Sostituisce la tabella con una visualizzazione a card */}
                        <div className="w-full space-y-4 pb-4">
                        {/* Header di ordinamento */}
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-t-lg shadow-sm">
                            <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordina per</h3>
                            <select 
                                className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                                onChange={(e) => {
                                const [columnDesc, newDirection] = e.target.value.split('|');
                                handleSort(columnDesc, newDirection);
                                }}
                            >
                                {response.columns.map((column) => (
                                <React.Fragment key={`sort-${column.desc}`}>
                                    <option value={`${column.desc}|asc`}>
                                    {column.desc} (A-Z)
                                    </option>
                                    <option value={`${column.desc}|desc`}>
                                    {column.desc} (Z-A)
                                    </option>
                                </React.Fragment>
                                ))}
                            </select>
                            </div>
                        </div>
                        
                        {/* Card per ogni riga */}
                        <div className="space-y-3 h-full w-full overflow-scroll">
                            {response.rows.map((row) => (
                            <div 
                                key={row.recordid} 
                                className="bg-white p-5 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                                onClick={() => handleRowClick && tableid && context && handleRowClick(context, row.recordid, tableid, masterTableid, masterRecordid)}
                            >
                                <Maximize2 className="text-white float-end"/>
                                <div className="p-4 space-y-2">
                                {row.fields.map((field, index) => {
                                    // Usa la descrizione della colonna come etichetta per il campo
                                    const columnLabel = response.columns[index]?.desc || `Campo ${index + 1}`;
                                    
                                    return (
                                    <div key={`${row.recordid}-${field.fieldid}`} className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{columnLabel}</span>
                                        <span className="text-sm text-gray-800 dark:text-gray-200">{field.value}</span>
                                    </div>
                                    );
                                })}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 flex justify-end">
                                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                    <span>Dettagli</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                        <nav aria-label="Page navigation example" className="h-1/6 text-center mt-4">
                            <ul className="inline-flex text-sm">
                                {/* Pulsante Previous */}
                                <li>
                                    <button 
                                        onClick={() => setTablePage(pagination.page - 1)} 
                                        disabled={pagination.page === 1} 
                                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-s-lg 
                                            ${pagination.page === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
                                            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                    >Previous</button>
                                </li>
                                
                                {/* Prima pagina */}
                                <li>
                                    <button 
                                        onClick={() => setTablePage(1)} 
                                        className={`flex items-center justify-center px-3 h-8 border 
                                            ${pagination.page === 1 ? 'text-white bg-blue-600' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
                                            dark:border-gray-700 ${pagination.page === 1 ? 'dark:bg-blue-600' : 'dark:bg-gray-800'} dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                    >1</button>
                                </li>
                                
                                {/* Puntini di sospensione (se necessario) */}
                                {pagination.page > 3 && (
                                    <li>
                                        <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span>
                                    </li>
                                )}
                                
                                {/* Pagina corrente (se non è la prima o l'ultima) */}
                                {pagination.page !== 1 && pagination.page !== pagination.limit && (
                                    <li>
                                        <button 
                                            className="flex items-center justify-center px-3 h-8 border text-white bg-blue-600 
                                                dark:border-gray-700 dark:bg-blue-600 dark:text-white"
                                        >{pagination.page}</button>
                                    </li>
                                )}
                                
                                {/* Puntini di sospensione (se necessario) */}
                                {pagination.page < pagination.limit - 2 && (
                                    <li>
                                        <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span>
                                    </li>
                                )}
                                
                                {/* Ultima pagina (se diversa dalla prima) */}
                                {pagination.limit > 1 && (
                                    <li>
                                        <button 
                                            onClick={() => setTablePage(pagination.limit)} 
                                            className={`flex items-center justify-center px-3 h-8 border 
                                                ${pagination.page === pagination.limit ? 'text-white bg-blue-600' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
                                                dark:border-gray-700 ${pagination.page === pagination.limit ? 'dark:bg-blue-600' : 'dark:bg-gray-800'} dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                        >{pagination.limit}</button>
                                    </li>
                                )}
                                
                                {/* Pulsante Next */}
                                <li>
                                    <button 
                                        onClick={() => setTablePage(pagination.page + 1)} 
                                        disabled={pagination.page === pagination.limit} 
                                        className={`flex items-center justify-center px-3 h-8 leading-tight border rounded-e-lg 
                                            ${pagination.page === pagination.limit ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} 
                                            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                    >Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    {tableid}
                </div>
            )}
        </GenericComponent>
    );
};