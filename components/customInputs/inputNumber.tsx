import React, { useEffect,useState } from 'react';

interface PropsInterface {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function InputNumber({ initialValue = '',onChange }: PropsInterface) {

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
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
          <input
            name="number"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Inserisci un valore"
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-0 sm:text-xs/6"
          />
        </div>
      </div>
    </div>
  );
};


