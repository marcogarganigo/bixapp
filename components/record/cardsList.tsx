import React, { useMemo, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../genericComponent';
import { useRecordsStore } from '@/utils/stores/recordsStore';
import Preview from '@/components/record/card/preview'

const isDev = false;

interface PropsInterface {
  tableid?: string;
  searchTerm?: string;
  view?: string;
  context?: string;
  masterTableid?: string;
  masterRecordid?: string;
}

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
  
  // Handle row click and pass context data to store
  const handleCardClick = (recordid: string) => {
    if (handleRowClick && tableid && context) {
      handleRowClick(context, recordid, tableid, masterTableid, masterRecordid);
    }
  };
  
  return (
    <GenericComponent 
      response={responseData} 
      loading={loading} 
      error={error} 
      title='cardsList' 
      elapsedTime={elapsedTime}
    > 
      {(response: ResponseInterface) => (
        <div className="h-full w-full overflow-y-auto px-2 py-4">
          <div className="w-full h-full">
            {response.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <p className="text-xl font-medium">Nessun elemento trovato</p>
                <p className="text-sm">Modifica i filtri o prova una nuova ricerca</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {response.rows.map((row) => (
                  <Preview 
                    key={row.recordid}
                    row={row}
                    columns={response.columns}
                    onRowClick={handleCardClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </GenericComponent>
  );
};