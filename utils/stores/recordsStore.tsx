import { create } from 'zustand';
import { checkAuth, logoutUser } from '@/utils/auth';

interface RecordsStore {
  refreshTable: number;
  setRefreshTable: (refreshTable: number) => void;

  cardsList: Array<{
    tableid: string;
    recordid: string;
    type: string;
    mastertableid?: string;
    masterrecordid?: string;
  }>;
  addCard: (
    tableid: string,
    recordid: string,
    type: string,
    mastertableid?: string,
    masterrecordid?: string
  ) => void;
  removeCard: (tableid: string, recordid: string) => void;
  resetCardsList: () => void;

  handleRowClick: (
    context: string,
    recordid: string,
    tableid: string,
    mastertableid?: string,
    masterrecordid?: string
  ) => Promise<void>;

  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;

  selectedMenu: string;
  setSelectedMenu: (menuName: string) => void;

  tableView: string;
  setTableView: (tableView: string) => void;

  columnOrder: string[];
  setColumnOrder: (column_order: string[]) => void;

  currentPage: number;
  setCurrentPage: (currentPage: number) => void;

  pageLimit: number;
  setPageLimit: (pageLimit: number) => void;

  tableid: string;
  setTableid: (tableid: string) => void;

  isPopupOpen: boolean;
  setIsPopupOpen: (isPopupOpen: boolean) => void;

  isFiltersOpen: boolean;
  setIsFiltersOpen: (isFiltersOpen: boolean) => void;

  popUpType: string;
  setPopUpType: (popUpType: string) => void;

  popupRecordId: string;
  setPopupRecordId: (recordid: string) => void;

  // Dati e funzioni di autenticazione (ex AppContext)
  user: string | null;
  setUser: (user: string | null) => void;

  role: string | null;
  setRole: (role: string | null) => void;

  chat: string | null;
  setChat: (chat: string | null) => void;

  telefono: string | null;
  setTelefono: (telefono: string | null) => void;

  userName: string | null;
  setUserName: (name: string | null) => void;

  activeServer: string | null;
  setActiveServer: (server: string | null) => void;

  loadingAuth: boolean;
  setLoadingAuth: (val: boolean) => void;

  handleLogout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

export const useRecordsStore = create<RecordsStore>((set, get) => ({
  refreshTable: 0,
  setRefreshTable: (refreshTable: number) => {
    const { resetCardsList } = get();
    resetCardsList();
    set({ refreshTable });
  },

  cardsList: [],
  addCard: (tableid, recordid, type, mastertableid, masterrecordid) =>
    set((state) => {
      const cardExists = state.cardsList.some(
        (card) =>
          card.tableid === tableid &&
          card.recordid === recordid &&
          card.mastertableid === mastertableid &&
          card.masterrecordid === masterrecordid
      );
      if (!cardExists) {
        return {
          cardsList: [
            ...state.cardsList,
            { tableid, recordid, type, mastertableid, masterrecordid },
          ],
        };
      }
      return state;
    }),
  removeCard: (tableid, recordid) =>
    set((state) => ({
      cardsList: state.cardsList.filter(
        (card) =>
          card.tableid !== tableid || card.recordid !== recordid
      ),
    })),
  resetCardsList: () => set({ cardsList: [] }),

  handleRowClick: async (
    context,
    recordid,
    tableid,
    mastertableid,
    masterrecordid
  ) => {
    const { resetCardsList, addCard, cardsList } = get();
    const tableType = context;

    if (tableType === 'standard') {
      if (cardsList.length > 0) {
        await resetCardsList();
      }
      addCard(tableid, recordid, tableType);
    } else {
      addCard(tableid, recordid, tableType, mastertableid, masterrecordid);
    }
  },

  searchTerm: '',
  setSearchTerm: (searchTerm) => set({ searchTerm }),

  selectedMenu: '',
  setSelectedMenu: (menuName) => set({ selectedMenu: menuName }),

  tableView: '',
  setTableView: (tableView) => set({ tableView }),

  columnOrder: [],
  setColumnOrder: (columnOrder) => set({ columnOrder }),

  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),

  pageLimit: 10,
  setPageLimit: (pageLimit) => set({ pageLimit }),

  tableid: '',
  setTableid: (tableid) => {
    const { resetCardsList } = get();
    resetCardsList();
    set({ tableid });
  },

  isPopupOpen: false,
  setIsPopupOpen: (isPopupOpen) => set({ isPopupOpen }),

  isFiltersOpen: false,
  setIsFiltersOpen: (isFiltersOpen) => set({ isFiltersOpen }),

  popUpType: '',
  setPopUpType: (popUpType) => set({ popUpType }),

  popupRecordId: '',
  setPopupRecordId: (recordid) => set({ popupRecordId: recordid }),

  // Autenticazione
  user: null,
  setUser: (user) => set({ user }),

  role: null,
  setRole: (role) => set({ role }),

  chat: null,
  setChat: (chat) => set({ chat }),

  telefono: null,
  setTelefono: (telefono) => set({ telefono }),

  userName: null,
  setUserName: (name) => set({ userName: name }),

  activeServer: null,
  setActiveServer: (server) => set({ activeServer: server }),

  loadingAuth: true,
  setLoadingAuth: (val) => set({ loadingAuth: val }),

  handleLogout: async () => {
    const result = await logoutUser();
    if (result.success) {
      set({
        user: null,
        role: null,
        chat: null,
        telefono: null,
        userName: null,
        activeServer: null,
      });
      
    } else {
      console.error('Logout fallito:', result.detail);
    }
  },

  verifyAuth: async () => {
    set({ loadingAuth: true });
    const result = await checkAuth();
    if (!result.isAuthenticated || !result.username) {
      // Qui puoi gestire il redirect dove richiami verifyAuth
      set({ loadingAuth: false });
      return;
    }

    set({
      user: result.username,
      role: result.role || null,
      chat: result.chat || null,
      telefono: result.telefono || null,
      userName: result.name ?? null,
      activeServer: result.activeServer ?? null,
      loadingAuth: false,
    });
  },
}));
