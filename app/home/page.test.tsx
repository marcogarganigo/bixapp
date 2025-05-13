/**
 * @jest-environment jsdom
 */

// Facciamo i mock diretti dei moduli senza usare gli alias @/
jest.mock('../../components/nav/navbar', () => ({
    __esModule: true,
    default: () => <div data-testid="navbar">Navbar Component</div>,
  }));
  
  jest.mock('../../components/nav/sidebar', () => ({
    __esModule: true,
    default: () => <div data-testid="sidebar">Sidebar Component</div>,
  }));
  
  jest.mock('../../components/mainContent', () => ({
    __esModule: true,
    default: ({ tableid }: { tableid: string }) => (
      <div data-testid="main-content">Main Content: {tableid}</div>
    ),
  }));
  
  // Mock di sonner
  jest.mock('sonner', () => ({
    Toaster: () => <div data-testid="toaster">Toaster Component</div>,
  }));
  
  // Mock dello store
  const mockSetTableid = jest.fn();
  let mockSelectedMenu = '';
  
  jest.mock('../../utils/stores/recordsStore', () => ({
    useRecordsStore: () => ({
      selectedMenu: mockSelectedMenu,
      setTableid: mockSetTableid,
    }),
  }));
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import Home from './page';
  
  describe('Home Page', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockSetTableid.mockClear();
      mockSelectedMenu = '';
    });
  
    it('renders all base components correctly', () => {
      render(<Home />);
      
      // Verifica che i componenti base siano renderizzati
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
  
    it('does not render MainContent when selectedMenu is empty', () => {
      mockSelectedMenu = '';
      
      render(<Home />);
      
      // MainContent non dovrebbe essere presente quando selectedMenu è vuoto
      expect(screen.queryByTestId('main-content')).not.toBeInTheDocument();
    });
  
    it('renders MainContent when selectedMenu has a value', () => {
      mockSelectedMenu = 'users';
      
      render(<Home />);
      
      // MainContent dovrebbe essere presente e mostrare il valore corretto
      const mainContent = screen.getByTestId('main-content');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveTextContent('Main Content: users');
    });
  
    it('calls setTableid with selectedMenu value on mount', () => {
      mockSelectedMenu = 'products';
      
      render(<Home />);
      
      // Verifica che setTableid venga chiamato con il valore corretto
      expect(mockSetTableid).toHaveBeenCalledWith('products');
    });
  
    it('calls setTableid when selectedMenu changes', () => {
      const { rerender } = render(<Home />);
      
      // Inizialmente setTableid non dovrebbe essere chiamato con una stringa vuota
      expect(mockSetTableid).not.toHaveBeenCalled();
      
      // Cambiamo il valore di selectedMenu
      mockSelectedMenu = 'orders';
      
      // Rirendering del componente
      rerender(<Home />);
      
      // Verifica che setTableid venga chiamato con il nuovo valore
      expect(mockSetTableid).toHaveBeenCalledWith('orders');
    });
  
    it('has correct layout classes', () => {
      const { container } = render(<Home />);
      
      // Verifica delle classi principali
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('w-full');
      expect(mainContainer).toHaveClass('h-screen');
      expect(mainContainer).toHaveClass('flex');
      
      // Verifico la struttura del layout
      const sidebar = screen.getByTestId('sidebar').parentElement;
      expect(sidebar).toHaveClass('h-screen');
      expect(sidebar).toHaveClass('bg-gray-800');
      expect(sidebar).toHaveClass('text-white');
      
      const contentContainer = sidebar?.nextSibling as HTMLElement;
      expect(contentContainer).toHaveClass('flex');
      expect(contentContainer).toHaveClass('flex-col');
      expect(contentContainer).toHaveClass('w-full');
      expect(contentContainer).toHaveClass('h-full');
    });
  });