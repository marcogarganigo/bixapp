import React, { useMemo, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from './genericComponent';
import { useRecordsStore } from '@/utils/stores/store';

const isDev = false;

interface PropsInterface {
  propExampleValue?: string;
}

interface ResponseInterface {
  views: {
    id: number;
    name: string;
  }[];
}

export default function QuickFilters({ propExampleValue }: PropsInterface) {

  const responseDataDEFAULT: ResponseInterface = {
    views: []
  };

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

  const [inputValue, setInputValue] = useState('');
  const [selectedView, setSelectedView] = useState(1);

  const {setSearchTerm, setTableView} = useRecordsStore();
  const {refreshTable, setRefreshTable, selectedMenu} = useRecordsStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setInputValue(keyword);
    setSearchTerm(keyword);
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const viewid = e.target.value;
    setSelectedView(parseInt(viewid));
    setTableView(viewid);
    researchTableSubmit();  
  }

  const researchTableSubmit = () => {
    setRefreshTable(refreshTable + 1);
  }

  const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

  const payload = useMemo(() => {
    if (isDev) return null;
    return {
      apiRoute: 'get_table_views',
      tableid: selectedMenu, 
    };
  }, [propExampleValue]);

  const { response, loading, error } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null };

  useEffect(() => {
    setInputValue('');
    setSearchTerm(inputValue);
    setTableView(selectedView.toString());
    if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
      setResponseData(response);
      setSelectedView(response.views[0].id);
    }
  }, [response, responseData, selectedView, selectedMenu]);

  return (
    <GenericComponent response={responseData} loading={loading} error={error} title="quickFilters" > 
      {(response: ResponseInterface) => (
        <div className="flex items-center justify-between w-full gap-3">
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