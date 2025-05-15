import React, { useEffect, useMemo, useState, KeyboardEvent } from 'react';
import Select, { SingleValue, MultiValue, ActionMeta } from 'react-select';

interface PropsInterface {
  lookupItems: Array<{ id: string; firstname: string; lastname: string }>;
  initialValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  isMulti?: boolean;
}

interface OptionType {
  value: string;
  label: string;
}

const customStyles = {
  control: () =>
    "min-h-[42px] rounded-lg border border-gray-300 bg-gray-50 hover:border-gray-500 focus:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 pl-2 pr-2",
  menu: () =>
    "mt-1 bg-white rounded-lg shadow-lg max-h-50 overflow-y-auto z-50",
  option: () =>
    "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900",
  singleValue: () => "text-sm text-gray-900",
  multiValue: () => "bg-blue-100 rounded-md m-1",
  multiValueLabel: () => "px-2 py-1 text-sm text-blue-700",
  multiValueRemove: () =>
    "px-2 py-1 hover:bg-blue-200 hover:text-blue-900 rounded-r-md",
  placeholder: () => "text-sm text-gray-500",
  input: () => "text-sm text-gray-900",
};

export default function SelectUser({
  lookupItems,
  initialValue = '',
  onChange,
  isMulti = false,
}: PropsInterface) {
  const options: OptionType[] = useMemo(
    () =>
      lookupItems.map((item) => ({
        value: String(item.id),
        label: `${item.firstname} ${item.lastname}`,
      })),
    [lookupItems]
  );

  const getInitialValue = () => {
    if (isMulti) {
      const initialValues = Array.isArray(initialValue)
        ? initialValue.map(val => String(val))
        : [String(initialValue)].filter(Boolean);
      return options.filter((option) => initialValues.includes(option.value));
    } else {
      return options.find((option) => option.value === String(initialValue)) || null;
    }
  };

  const [selectedOption, setSelectedOption] = useState<
    OptionType | OptionType[] | null
  >(getInitialValue());

  useEffect(() => {
    const computed = getInitialValue();
    console.log("DEBUG: lookupItems:", lookupItems);
    console.log("DEBUG: options:", options);
    console.log("DEBUG: computed selectedOption:", computed);
    setSelectedOption(computed);
  }, [initialValue, isMulti, lookupItems, options]);

  useEffect(() => {
    console.log("DEBUG: initialValue ricevuto:", initialValue);
  }, [initialValue]);

  const handleChange = (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    setSelectedOption(newValue);
    if (onChange) {
      if (isMulti) {
        const values = (newValue as MultiValue<OptionType>).map(
          (option) => option.value
        );
        onChange(values);
      } else {
        const value = newValue
          ? (newValue as SingleValue<OptionType>).value
          : '';
        onChange(value);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const select = event.target as HTMLElement;
      const menu = select.querySelector('[class$="-menu"]');
      if (menu) {
        const firstOption = menu.querySelector('[class$="-option"]');
        if (firstOption) {
          (firstOption as HTMLElement).click();
        }
      }
    }
  };

  useEffect(() => {
        if(onChange && initialValue){
          onChange(initialValue);
        } 
      }, [initialValue]);

  return (
    <div className="relative">
      <Select
        isMulti={isMulti}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Seleziona un utente"
        isClearable
        getOptionValue={(option: OptionType) => option.value}
        getOptionLabel={(option: OptionType) => option.label}
        classNames={{
          container: () => "relative",
          control: () => customStyles.control(),
          menu: () => customStyles.menu(),
          option: () => customStyles.option(),
          singleValue: () => customStyles.singleValue(),
          multiValue: () => customStyles.multiValue(),
          multiValueLabel: () => customStyles.multiValueLabel(),
          multiValueRemove: () => customStyles.multiValueRemove(),
          placeholder: () => customStyles.placeholder(),
          input: () => customStyles.input(),
        }}
        unstyled
      />
    </div>
  );
}
