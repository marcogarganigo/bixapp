import React, { use, useMemo } from 'react';
import { useRecordsStore } from '@/utils/stores/recordsStore';

// INTERFACCIA PROPS
interface PropsInterface {
  tableid?: string;
  searchTerm?: string;
}

export default function ExampleComponent({ tableid, searchTerm }: PropsInterface) {

  return (
    <div> </div>
  );
};

