import React, { useState, useEffect } from 'react';
import {useRecordsStore} from '@/utils/stores/recordsStore';
import QuickFilters from './quickFilters';
import RecordCard from './record/card/mainBody';
import GenericComponent from './genericComponent';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import axiosInstanceClient from '@/utils/axiosInstanceClient';
import { Table } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import CardsList from './record/cardsList';


// INTERFACCIA PROPS
interface PropsInterface {
  tableid: string;
}

export default function MainContent({ tableid }: PropsInterface) {

  const [recordid] = useState('')
  const {refreshTable, setRefreshTable} = useRecordsStore();
  const {cardsList, addCard, removeCard, resetCardsList, handleRowClick} = useRecordsStore();
  const {searchTerm, tableView} = useRecordsStore();

  const refreshTableFunc = () => {
    setRefreshTable(refreshTable + 1);
  }

  useEffect(() => {
    if (recordid) {
      resetCardsList();
      addCard(tableid, recordid, 'standard');
    }
  }, [recordid]);

  return (
    <GenericComponent title="MainContent"> 
      {(data) => (
        <div className="h-full w-full shadow-2xl bg-white rounded-lg p-4">
          {cardsList.map((card, index) => (
            <RecordCard 
              key={`${card.tableid}-${card.recordid}`}
              tableid={card.tableid} 
              recordid={card.recordid}
              mastertableid={card.mastertableid}
              masterrecordid={card.masterrecordid}
              index={index}
              total={cardsList.length}
              type={card.type}
            />
          ))}
          <div className="flex flex-wrap h-min w-full mb-2">
            <div className="w-2/3">
              <QuickFilters></QuickFilters>
            </div>
            <div className="w-1/3 h-1/2 flex justify-end gap-3">
              <>
                <button
                  type="button"
                  className="font-bold inline-flex items-center px-2 py-1.5 text-xs  text-white bg-red-500 rounded-lg hover:bg-red-500 transition-all duration-100 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => handleRowClick('', "", tableid)}
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={refreshTableFunc}
                >
                  <ArrowPathIcon className="w-4 h-4 " />
                </button>
              </>
            </div>
          </div>
          <div className="w-full h-11/12 flex gap-4 mb-4">
            <div className="w-full h-full flex flex-nowrap overflow-x-auto overflow-y-hidden p-2">
              <div className="w-full h-full">
                <CardsList
                  tableid={tableid}
                  searchTerm={searchTerm}
                  view={tableView}
                  context='standard'
                ></CardsList>
              </div>
            </div>
          </div>
        </div>
      )}
    </GenericComponent>
  );
};