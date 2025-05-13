import React from 'react';
import { Maximize2, ArrowUpRight } from 'lucide-react';

// Define interfaces for component props
interface PreviewProps {
  row: {
    recordid: string;
    css: string;
    fields: Array<{
      recordid?: string;
      css: string;
      type: string;
      value: string;
      fieldid: string;
    }>;
  };
  columns: Array<{    
    fieldtypeid: string;
    desc: string;
  }>;
  onRowClick: (recordid: string) => void;
}

export const Preview: React.FC<PreviewProps> = ({ row, columns, onRowClick }) => {
  // Funzione per ottenere un valore di campo principale (il primo campo come titolo)
  const getMainTitle = () => {
    if (row.fields.length > 0) {
      return row.fields[0].value || 'Senza titolo';
    }
    return 'Senza titolo';
  };

  // Funzione per truncare il testo se è troppo lungo
  const truncateText = (text: string, maxLength = 25) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header con il bottone di espansione */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-800  truncate">
          {getMainTitle()}
        </h3>
        <button
          type="button"
          onClick={() => onRowClick(row.recordid)}
          className="text-gray-500  p-1 rounded-full hover:bg-gray-100 transition-colors"
          title="Espandi"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Contenuto principale */}
      <div className="p-4 flex-1 grid grid-cols-2 gap-3">
        {row.fields.slice(1).map((field, index) => {
          const actualIndex = index + 1; // Perché abbiamo già utilizzato il primo campo come titolo
          const columnLabel = columns[actualIndex]?.desc || `Campo ${actualIndex + 1}`;
          
          return (
            <div key={`${row.recordid}-${field.fieldid}`} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {columnLabel}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {field.value === null || field.value === '' ? '-' : truncateText(field.value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer con azione principale */}
      
    </div>
  );
};

export default Preview;