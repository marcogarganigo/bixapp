import React, { useEffect, useState } from 'react';

interface PropsInterface {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function InputWord({ initialValue = '', onChange }: PropsInterface) {
  const [value, setValue] = useState(initialValue ?? '');
  useEffect(() => {
        setValue(initialValue ?? ''); 
        if(onChange && initialValue){
          onChange(initialValue);
        } 
      }, [initialValue]);

  useEffect(() => {
    if (onChange && value !== initialValue) {
      onChange(value);
    }
  }, [value, onChange, initialValue]);

  return (
    <div>
      <div className="">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            name="word"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)} // Aggiorna lo stato locale
            placeholder="Inserisci un valore"
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 "
          />
        </div>
      </div>
    </div>
  );
};
