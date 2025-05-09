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
        <GenericComponent 
            response={responseData} 
            loading={loading} 
            error={error} 
            title='recordsTable' 
            elapsedTime={elapsedTime}
        > 
            {(response: ResponseInterface) => (
                <div className="h-full w-full overflow-y-scroll">
                    <div className="w-full h-full relative rounded-lg drop-shadow-md">
                        {/* Visualizzazione a card */}
                        <div className="w-full space-y-4 pb-4">
                            {/* Card per ogni riga */}
                            <div className="space-y-3 h-full w-full mt-2">
                                {response.rows.map((row) => (
                                    <div 
                                        key={row.recordid} 
                                        className="bg-white p-5 dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleRowClick && tableid && context && handleRowClick(context, row.recordid, tableid, masterTableid, masterRecordid)}
                                            className="w-min h-full float-end hover:cursor-pointer hover:scale-105"
                                        >
                                            <Maximize2 className="text-white"/>
                                        </button>
    
                                        <div className="p-4 space-y-2">
                                            {row.fields.map((field, index) => {
                                                // Usa la descrizione della colonna come etichetta per il campo
                                                const columnLabel = response.columns[index]?.desc || `Campo ${index + 1}`;
                                                
                                                return (
                                                    <div key={`${row.recordid}-${field.fieldid}`} className="flex flex-col">
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            {columnLabel}
                                                        </span>
                                                        <span className="text-sm text-gray-800 dark:text-gray-200">
                                                            {field.value}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </GenericComponent>
    );
};