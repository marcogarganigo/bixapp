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

  tableid: string;
  setTableid: (tableid: string) => void;

  user: string | null;
  setUser: (user: string | null) => void;

  userName: string | null;
  setUserName: (name: string | null) => void;

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

  tableid: '',
  setTableid: (tableid) => {
    const { resetCardsList } = get();
    resetCardsList();
    set({ tableid });
  },

  user: null,
  setUser: (user) => set({ user }),

  userName: null,
  setUserName: (name) => set({ userName: name }),


  loadingAuth: true,
  setLoadingAuth: (val) => set({ loadingAuth: val }),

  handleLogout: async () => {
    const result = await logoutUser();
    if (result.success) {
      set({
        user: null,
        userName: null,
      });
      
    } else {
      console.error('Logout fallito:', result.detail);
    }
  },

  verifyAuth: async () => {
    set({ loadingAuth: true });
    const result = await checkAuth();
    if (!result.isAuthenticated || !result.username) {
      set({ loadingAuth: false });
      return;
    }

    set({
      user: result.username,
      userName: result.name ?? null,
      loadingAuth: false,
    });
  },
}));
