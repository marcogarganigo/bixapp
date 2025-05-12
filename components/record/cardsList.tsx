import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../genericComponent';
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
  view?: string;
  context?: string;
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

export default function CardsList({ tableid, searchTerm, view, context, masterTableid, masterRecordid }: PropsInterface) {
  useEffect(() => {
    const unsub = useRecordsStore.subscribe((state, prevState) => {
      console.log('[zustand]', { prev: prevState, next: state });
    });
    return unsub;
  }, []);

  const devPropExampleValue = isDev ? "Example prop" : tableid + ' ' + searchTerm + ' ' + ' ' + context;

  const responseDataDEFAULT: ResponseInterface = {
    rows: [],
    columns: []
  };

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

  const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

  const refreshTable    = useRecordsStore(s => s.refreshTable);
  const setRefreshTable = useRecordsStore(s => s.setRefreshTable);
  const handleRowClick  = useRecordsStore(s => s.handleRowClick);

  const payload = useMemo(() => {
    if (isDev) return null;
    return {
      apiRoute: 'get_table_records',
      tableid: tableid,
      searchTerm: searchTerm,
      view: view,
      masterTableid: masterTableid,
      masterRecordid: masterRecordid
    };
  }, [refreshTable, tableid, searchTerm, view, masterTableid, masterRecordid]);

  const { response, loading, error, elapsedTime } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null, elapsedTime:null };

  useEffect(() => {
    if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
      setResponseData(response);
    }
  }, [response, responseData]);

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
      title='cardsList' 
      elapsedTime={elapsedTime}
    > 
      {(response: ResponseInterface) => (
        <div className="h-full w-full overflow-y-scroll">
          <div className="w-full h-full relative rounded-lg drop-shadow-md">
            <div className="w-full space-y-4 pb-4">
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
                        const columnLabel = response.columns[index]?.desc || `Campo ${index + 1}`;
                        
                        return (
                          <div key={`${row.recordid}-${field.fieldid}`} className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {columnLabel}
                            </span>
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              {field.value === null ? '-' : field.value === '' ? '-' : field.value}
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