import React, { useMemo, useState, useEffect } from 'react';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../../genericComponent';
import InputWord from '@/components/customInputs/inputWord';
import InputNumber from '@/components/customInputs/inputNumber';
import InputDate from '@/components/customInputs/inputDate';
import InputMemo from '@/components/customInputs/inputMemo';
import InputCheckbox from '@/components/customInputs/inputCheckbox';
import SelectUser from '@/components/customInputs/selectUser';
import SelectStandard from '@/components/customInputs/selectStandard';
import InputLinked from '@/components/customInputs/inputLinked';
import InputEditor from '@/components/customInputs/inputEditor';
import InputFile from '@/components/customInputs/inputFile';
import { toast } from 'sonner';
import axiosInstanceClient from '@/utils/axiosInstanceClient';
import { useRecordsStore } from '@/utils/stores/store';

const isDev = false;

        interface PropsInterface {
          tableid: string;
          recordid: string;
          mastertableid?: string;
          masterrecordid?: string;
        }

        interface ResponseInterface {
            fields: Array<{
                tableid: string;
                fieldid: string;
                fieldorder: string;
                description: string;
                value: string | { code: string; value: string };
                fieldtype: string;
                lookupitems?: Array<{itemcode: string, itemdesc: string}>;
                lookupitemsuser? : Array<{id: string, firstname: string, lastname: string, link: string, linkdefield: string, linkedvalue: string}>;
                fieldtypewebid?: string;
                linked_mastertable?: string;
                settings: string | {calcolato: string, default: string, nascosto: string, obbligatorio: string};
                isMulti?: boolean;
            }>,
            recordid: string;
        }

export default function CardFields({ tableid,recordid,mastertableid,masterrecordid }: PropsInterface) {

            const responseDataDEFAULT: ResponseInterface = {
                fields: [],
                recordid: '',
              };

            const responseDataDEV: ResponseInterface = {
                fields: [
                    {
                        tableid: "1",
                        fieldid: "test1",
                        fieldorder: "1",
                        description: "Test 1",
                        value: { code: '00000000000000000000000000000415', value: 'test1' },
                        fieldtype: "linkedmaster",
                        linked_mastertable: "contact",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'true'}
                    },
                    {
                        tableid: "1",
                        fieldid: "test2",
                        fieldorder: "2",
                        description: "Test 2",
                        value: { code: '2', value: '2' },
                        fieldtype: "Numero",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'}
            
                    },
                    {
                        tableid: "1",
                        fieldid: "test3",
                        fieldorder: "3",
                        description: "Test 3",
                        value: { code: '2024-10-30', value: '30/10/2024' },
                        fieldtype: "Data",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'}
            
                    },
                    {
                        tableid: "1",
                        fieldid: "test4",
                        fieldorder: "4",
                        description: "Test 4",
                        value: { code: 'test4', value: 'test4' },
                        fieldtype: "Memo",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'}
            
                    },
                    {
                        tableid: "1",
                        fieldid: "test5",
                        fieldorder: "5",
                        description: "Test 5",
                        value: { code: '2', value: '2' },
                        fieldtype: "Utente",
                        lookupitemsuser: [
                            {id: '1', firstname: 'Mario', lastname: 'Rossi', link: 'user', linkdefield: 'id', linkedvalue: '1'},
                            {id: '2', firstname: 'Luca', lastname: 'Bianchi', link: 'user', linkdefield: 'id', linkedvalue: '2'},
                            {id: '3', firstname: 'Mario', lastname: 'Rossi', link: 'user', linkdefield: 'id', linkedvalue: '3'},
                            {id: '4', firstname: 'Mario', lastname: 'Rossi', link: 'user', linkdefield: 'id', linkedvalue: '4'},
                            {id: '5', firstname: 'Mario', lastname: 'Rossi', link: 'user', linkdefield: 'id', linkedvalue: '5'},
            
            
            
                        ],
                        fieldtypewebid: "multiselect",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'}
            
                    },
                    {
                        tableid: "1",
                        fieldid: "test7",
                        fieldorder: "7",
                        description: "Test 7",
                        value: { code: 'test77', value: 'test7' },
                        fieldtype: "Attachment",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'}
                    },
                    {
                        tableid: "1",
                        fieldid: "test8",
                        fieldorder: "5",
                        description: "Test 8",
                        value: { code: '2', value: '2' },
                        fieldtype: "Categoria",
                        lookupitems: [
                            {itemcode: '1', itemdesc: 'Mario'},
                            {itemcode: '2', itemdesc: 'Luca'},
                            {itemcode: '3', itemdesc: 'Mario'},
                            {itemcode: '4', itemdesc: 'Mario'},
                            {itemcode: '5', itemdesc: 'Mario'},
                        ],
                        fieldtypewebid: "",
                        settings: {calcolato: 'false', default: '', nascosto: 'false', obbligatorio: 'false'},
                    },
                ],
                recordid: "0000"
            };

            
    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);
    const [updatedFields, setUpdatedFields] = useState<{ [key: string]: string | string[] }>({});

    const {removeCard,refreshTable,setRefreshTable,handleRowClick} = useRecordsStore();


    const currentValues = useMemo(() => {
        const obj: Record<string, any> = {};

        responseData.fields.forEach(f => {
            const backendValue =
                typeof f.value === 'object'
                    ? (f.value as any).code ?? (f.value as any).value
                    : f.value;

            obj[f.fieldid] = updatedFields.hasOwnProperty(f.fieldid)
                ? updatedFields[f.fieldid]
                : backendValue ?? '';
        });

        return obj;
    }, [responseData, updatedFields]);

    const handleInputChange = (fieldid: string, newValue: any | any[]) => {
        setUpdatedFields(prev => {
            if (prev[fieldid] === newValue) {
                return prev;
            }
            return {
                ...prev,
                [fieldid]: newValue,
            };
        });
    };
    
    
      const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('tableid', tableid || '');
            formData.append('recordid', recordid || '');
            
            const standardFields: { [key: string]: any } = {};
            
            Object.entries(updatedFields).forEach(([fieldId, value]) => {
                if (value instanceof File) {
                    formData.append(`files[${fieldId}]`, value);
                } else {
                    standardFields[fieldId] = value;
                }
            });
            
            formData.append('fields', JSON.stringify(standardFields));
            formData.append('apiRoute', 'save_record_fields');

            console.log(formData)
            console.log("axiosInstanceClient:save_record_fields")
            const saveResponse = await axiosInstanceClient.post('/postApi', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                });
                
            toast.success('Record salvato con successo');
            recordid = responseData.recordid;
            setUpdatedFields({});
        } catch (error) {
            console.error('Errore durante il salvataggio del record:', error);
            toast.error('Errore durante il salvataggio del record');
        } finally {
            setRefreshTable(refreshTable+1)
            if (mastertableid && masterrecordid) {
                removeCard(tableid, recordid);
                handleRowClick('standard', masterrecordid, mastertableid, mastertableid, masterrecordid);

            } else {
                removeCard(tableid, recordid);
            }
        }
    };
    


    const payload = useMemo(() => {
        if (isDev) return null;
        return {
            apiRoute: 'get_record_card_fields',
            tableid: tableid,
            recordid: recordid,
            mastertableid: mastertableid, 
            masterrecordid: masterrecordid
        };
    }, [tableid,recordid]);

    const { response, loading, error } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null };


    useEffect(() => {
        if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
            setResponseData(response);
        }                                     
    }, [response, isDev, responseData]);
    

    return (
        <GenericComponent response={responseData} loading={loading} error={error} title="CardFields">
            {(response: ResponseInterface) => (
                <div className="h-full">
                    <div className="h-11/12 flex flex-col overflow-y-scroll overflow-x-hidden space-y-3">
                        {response.fields.map(field => {
                            const rawValue = typeof field.value === 'object' ? field.value?.value : field.value;
                            const initialValue = rawValue ?? '';

                            return (
                                <div key={`${field.fieldid}-container`} className="flex items-center space-x-4 w-full">
                                    <div className="w-1/4 text-xs">
                                        <p className="text-black">
                                        {field.description}
                                        {typeof field.settings === 'object' && field.settings.obbligatorio === 'true' && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                        </p>
                                    </div>
                                                                    
                                    <div className="w-3/4 text-xs mb-2">
                                        {field.fieldtype === 'Parola' ? (
                                            <InputWord
                                                initialValue={initialValue} 
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)} 
                                            />
                                        ) : field.fieldtype === 'Categoria' && field.lookupitems ? (
                                            <SelectStandard
                                                lookupItems={field.lookupitems}
                                                initialValue={initialValue}
                                                onChange={(value: string | string[]) => handleInputChange(field.fieldid, value)}
                                                isMulti={field.fieldtypewebid === 'multiselect'}
                                            />
                                        ) : field.fieldtype === 'Numero' ? (
                                            <InputNumber 
                                                initialValue={initialValue} 
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)} 
                                            />
                                        ) : field.fieldtype === 'Data' ? (
                                            <InputDate 
                                                initialValue={initialValue} 
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)} 
                                            />
                                        ) : field.fieldtype === 'Memo' ? (
                                            <InputMemo 
                                                initialValue={initialValue} 
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)} 
                                            />
                                        ) : field.fieldtype === 'Checkbox' ? (
                                            <InputCheckbox 
                                                initialValue={initialValue} 
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)} 
                                            /> 
                                        ) : field.fieldtype === 'Utente' && field.lookupitemsuser ? (
                                            <SelectUser
                                                lookupItems={field.lookupitemsuser}
                                                initialValue={initialValue}
                                                onChange={(value: string | string[]) => handleInputChange(field.fieldid, value)}
                                                isMulti={field.fieldtypewebid === 'multiselect'}
                                            />
                                        ) : field.fieldtype === 'linkedmaster' ? (
                                            <InputLinked 
                                                initialValue={initialValue}
                                                valuecode={typeof field.value === 'object' ? field.value : undefined}
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)}
                                                tableid={tableid}
                                                linkedmaster_tableid={field.linked_mastertable}
                                                linkedmaster_recordid={initialValue}
                                                fieldid={field.fieldid}
                                                formValues={currentValues}  
                                            />
                                        ) : field.fieldtype === 'LongText' ? (
                                            <InputEditor 
                                                initialValue={initialValue}
                                                onChange={(value: string) => handleInputChange(field.fieldid, value)}
                                            />
                                        ) : field.fieldtype === 'Attachment' ? (
                                            <InputFile
                                                initialValue={
                                                    initialValue
                                                        ? `/api/media-proxy?url=${initialValue}`
                                                        : null
                                                }
                                                onChange={(value: File | null) => handleInputChange(field.fieldid, value)}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="h-min w-full">
                        <button type="button" onClick={handleSave} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 me-2 mt-4 h-min xs:mb-2">
                                Salva
                        </button>
                    </div>
                </div>
            )}
        </GenericComponent>
    );
};
