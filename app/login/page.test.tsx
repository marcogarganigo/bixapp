/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './page';

// Mock dei moduli Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

// Mock delle API e dei moduli esterni
jest.mock('../../utils/auth', () => ({
  loginUserApi: jest.fn(),
  getActiveServer: jest.fn(() => Promise.resolve({ activeServer: 'test-server' })),
}));

jest.mock('../../components/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock di sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster">Toaster Component</div>,
}));

// Import dei moduli mockati per i test
import { loginUserApi, getActiveServer } from '../../utils/auth';
import { toast } from 'sonner';

describe('Login Page', () => {
  const mockLoginUserApi = loginUserApi as jest.Mock;
  const mockGetActiveServer = getActiveServer as jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset dei mock
    mockGetActiveServer.mockResolvedValue({ activeServer: 'test-server' });
    mockPush.mockClear();
  });

  it('renders the login form correctly', async () => {
    render(<Login />);
    
    // Verifico che gli elementi del form siano presenti
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accedi/i })).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    
    // Verifico che l'immagine sia caricata correttamente
    await waitFor(() => {
      const image = screen.getByAltText('test-server');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/imgs/swissbix.png');
    });
  });

  it('loads active server on mount', async () => {
    render(<Login />);
    
    // Verifico che getActiveServer sia chiamato
    await waitFor(() => {
      expect(mockGetActiveServer).toHaveBeenCalledTimes(1);
    });
  });

  it('handles input changes', () => {
    render(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Simulo l'inserimento di username e password
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpassword');
  });

  it('handles successful login submission', async () => {
    mockLoginUserApi.mockResolvedValueOnce({ success: true });
    
    render(<Login />);
    
    // Inserisco le credenziali
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
    
    // Submitto il form
    fireEvent.click(screen.getByRole('button', { name: /accedi/i }));
    
    // Verifico che loginUserApi sia chiamato con i parametri corretti
    await waitFor(() => {
      expect(mockLoginUserApi).toHaveBeenCalledWith('testuser', 'testpassword');
    });
    
    // Verifico che il componente di caricamento sia visibile durante il login
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Verifico che la navigazione avvenga dopo il login
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('handles failed login submission', async () => {
    mockLoginUserApi.mockResolvedValueOnce({ 
      success: false, 
      detail: 'Credenziali non valide' 
    });
    
    render(<Login />);
    
    // Inserisco le credenziali
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    
    // Submitto il form
    fireEvent.click(screen.getByRole('button', { name: /accedi/i }));
    
    // Verifico che loginUserApi sia chiamato con i parametri corretti
    await waitFor(() => {
      expect(mockLoginUserApi).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    });
    
    // Verifico che venga mostrato il messaggio di errore
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Credenziali non valide');
    });
    
    // Verifico che non avvenga la navigazione
    expect(mockPush).not.toHaveBeenCalled();
    
    // Verifico che il componente di caricamento non sia più visibile dopo l'errore
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeNull();
    });
  });

  it('handles login with generic error message when no detail is provided', async () => {
    mockLoginUserApi.mockResolvedValueOnce({ 
      success: false 
    });
    
    render(<Login />);
    
    // Submitto il form
    fireEvent.click(screen.getByRole('button', { name: /accedi/i }));
    
    // Verifico che venga mostrato il messaggio di errore generico
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Errore durante il login');
    });
  });

  it('has the correct styling and layout classes', () => {
    const { container } = render(<Login />);
    
    // Verifica delle classi principali per il layout
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('min-h-full');
    expect(mainContainer).toHaveClass('flex-1');
    
    // Verifica del pulsante di login
    const loginButton = screen.getByRole('button', { name: /accedi/i });
    expect(loginButton).toHaveClass('bg-bixcolor-default');
    expect(loginButton).toHaveClass('text-white');
  });
});