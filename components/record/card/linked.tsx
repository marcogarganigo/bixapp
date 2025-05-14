import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../../genericComponent';
import { ChevronDown, SquarePlus } from 'lucide-react';
import CardsList from '@/components/record/cardsList';
import { useRecordsStore } from '@/utils/stores/store';
const isDev = false;

interface PropsInterface {
  tableid: string;
  recordid: string;
}

interface ResponseInterface {
  linkedTables: Array<{
    tableid: string;
    description: string;
    rowsCount: number;
  }>;
}

export default function CardLinked({ tableid, recordid }: PropsInterface) {

  const responseDataDEFAULT: ResponseInterface = {
    linkedTables: []
  };

  // DATI RESPONSE PER LO SVILUPPO 
  const responseDataDEV: ResponseInterface = {
    linkedTables: [
      {
        tableid: "company",
        description: "Azienda",
        rowsCount: 1,
      },
      {
        tableid: "contact",
        description: "Contatti",
        rowsCount: 1,
      },
      {
        tableid: "tableid",
        description: "test",
        rowsCount: 1,
      },
      {
        tableid: "tableid",
        description: "test",
        rowsCount: 1,
      }
    ]
  };

  const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

  const [openCards, setOpenCards] = useState<boolean[]>(new Array(responseDataDEV.linkedTables.length).fill(false));

  const { handleRowClick } = useRecordsStore();

  const handleCollapse = (index: number) => {
    setOpenCards(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const payload = useMemo(() => {
    if (isDev) return null;
    return {
      apiRoute: 'get_record_linked_tables',
      masterTableid: tableid,
      masterRecordid: recordid,
    };
  }, [recordid, tableid]);

  const { response, loading, error } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null };

  useEffect(() => {
    if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
      setResponseData(response);
      setOpenCards(new Array(response.linkedTables.length).fill(false));
    }
  }, [response, responseData]);

  return (
    <GenericComponent response={responseData} loading={loading} error={error} title="cardLinked">
      {(response: ResponseInterface) => (
        <div className="h-full w-full flex flex-col overflow-y-auto overflow-x-hidden">
          {response.linkedTables.length > 0 ? (
            response.linkedTables.map((table, index) => (
              <React.Fragment key={index}>
                <div
                  className="w-full mx-auto border border-gray-200 rounded-md p-2 shadow mt-2"
                  onClick={() => handleCollapse(index)}
                >
                  <div className="w-full">
                    {table.rowsCount > 0 && (
                      <span className="float-start bg-primary text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded">{table.rowsCount}</span>
                    )}
                    {table.rowsCount == 0 && (
                      <span className="float-start text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded"></span>
                    )}
                    <p className="text-black float-start">{` ${table.description}`}</p>
                    <ChevronDown className={`text-gray-400 float-end transform transition-transform ${openCards[index] ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <div
                  className={`w-full h-4/6 rounded-md p-3 transition-all duration-300 
                    ${openCards[index] ? 'animate-cardslide-in' : 'animate-cardslide-out'}
                    ${!openCards[index] && 'hidden'}`}
                >
                  <button className="font-semibold flex items-center text-bixcolor-default px-4 py-2 rounded hover:-rotate-2  hover:scale-110 transition-all duration-100" onClick={() => handleRowClick('linked', '', table.tableid, tableid, recordid)}>
                    <SquarePlus name="Plus" className="mr-2" />
                    Aggiungi
                  </button>

                  <div className="h-11/12">
                    <CardsList
                      tableid={table.tableid}
                      searchTerm={''}
                      context="linked"
                      masterTableid={tableid}
                      masterRecordid={recordid}
                    />
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              Nessuna tabella collegata da mostrare
            </div>
          )}
        </div>
      )}
    </GenericComponent>
  );
};