import { render, screen } from '@testing-library/react';
import CardsList from "@/components/record/cardsList"
import * as useApiHook from '@/utils/useApi';
import * as recordsStore from '@/utils/stores/recordsStore';
import React from 'react';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

// Mocks
jest.mock('../genericComponent', () => ({
    __esModule: true,
    default: jest.fn(({ response, children }) => <div>{children(response)}</div>),
  }));

jest.mock('lucide-react', () => ({
  Maximize2: () => <div data-testid="maximize-icon" />,
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/utils/axiosInstance', () => ({}));

describe('CardsList component', () => {
  beforeEach(() => {
    // Mock Zustand store
    jest.spyOn(recordsStore, 'useRecordsStore').mockImplementation((selector: any) =>
      selector({
        refreshTable: false,
        setRefreshTable: jest.fn(),
        handleRowClick: jest.fn(),
      })
    );

    // Mock useApi hook
    jest.spyOn(useApiHook, 'useApi').mockReturnValue({
      response: {
        rows: [
          {
            recordid: '1',
            css: '',
            fields: [
              { css: '', type: 'standard', value: 'Product 1', fieldid: '1' },
              { css: '', type: 'standard', value: 'Black', fieldid: '2' },
            ],
          },
        ],
        columns: [
          { fieldtypeid: 'text', desc: 'Name' },
          { fieldtypeid: 'text', desc: 'Color' },
        ],
      },
      loading: false,
      error: null,
      elapsedTime: 123,
    });
  });

  it('renders card fields correctly', () => {
    render(<CardsList tableid="t1" searchTerm="mac" view="v1" context="ctx" />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();

    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();

    expect(screen.getByTestId('maximize-icon')).toBeInTheDocument();
  });
});
