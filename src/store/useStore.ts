import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/tauri';

export interface Transaction {
  id: number;
  person_name: string;
  person_avatar?: string;
  category: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  reason: string;
  responsible_person?: string;
  created_at: string;
}

export interface NewTransaction {
  person_name: string;
  person_avatar?: string;
  category: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  reason: string;
  responsible_person?: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  status: string;
  avatar?: string;
  password: string;
  department?: string;
  created_at: string;
  last_login?: string;
}

export interface NewUser {
  username: string;
  full_name: string;
  role: string;
  password: string;
  department?: string;
}

export interface UpdateUser {
  full_name?: string;
  role?: string;
  status?: string;
  department?: string;
  password?: string;
}

export interface UserActivity {
  id: number;
  username: string;
  activity: string;
  created_at: string;
}

interface AppState {
  dailyBudget: number;
  dailyExpenses: number;
  transactions: Transaction[];
  users: User[];
  userActivity: UserActivity[];
  loading: boolean;
  error: string | null;
  
  fetchDailyStats: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: NewTransaction) => Promise<void>;
  updateTransaction: (id: number, transaction: NewTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  searchTransactions: (query: string, filterType?: string) => Promise<void>;
  
  // User management
  fetchUsers: () => Promise<void>;
  fetchUserActivity: () => Promise<void>;
  addUser: (user: NewUser) => Promise<void>;
  updateUser: (id: number, user: UpdateUser) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  dailyBudget: 0,
  dailyExpenses: 0,
  transactions: [],
  users: [],
  userActivity: [],
  loading: false,
  error: null,
  
  fetchDailyStats: async () => {
    try {
      set({ loading: true, error: null });
      const budget = await invoke<number>('get_daily_budget');
      const expenses = await invoke<number>('get_daily_expenses');
      set({ dailyBudget: budget, dailyExpenses: expenses, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const transactions = await invoke<Transaction[]>('get_today_transactions');
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  addTransaction: async (transaction: NewTransaction) => {
    try {
      set({ loading: true, error: null });
      await invoke('add_transaction', { transaction });
      // Refresh data
      const transactions = await invoke<Transaction[]>('get_today_transactions');
      const expenses = await invoke<number>('get_daily_expenses');
      set({ transactions, dailyExpenses: expenses, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  updateTransaction: async (id: number, transaction: NewTransaction) => {
    try {
      set({ loading: true, error: null });
      // TODO: إضافة أمر Tauri للتحديث
      // await invoke('update_transaction', { id, transaction });
      
      // مؤقتاً: تحديث محلي
      const currentTransactions = await invoke<Transaction[]>('get_today_transactions');
      set({ transactions: currentTransactions, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  deleteTransaction: async (id: number) => {
    try {
      set({ loading: true, error: null });
      // TODO: إضافة أمر Tauri للحذف
      // await invoke('delete_transaction', { id });
      
      // مؤقتاً: حذف محلي
      set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id),
        loading: false,
      }));
      
      // تحديث المصروفات
      const expenses = await invoke<number>('get_daily_expenses');
      set({ dailyExpenses: expenses });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  searchTransactions: async (query: string, filterType?: string) => {
    try {
      set({ loading: true, error: null });
      const filter = {
        search_query: query || undefined,
        filter_type: filterType,
        date: new Date().toISOString().split('T')[0],
      };
      const transactions = await invoke<Transaction[]>('search_transactions', { filter });
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  // User management
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const users = await invoke<User[]>('get_all_users');
      set({ users, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  fetchUserActivity: async () => {
    try {
      set({ loading: true, error: null });
      const userActivity = await invoke<UserActivity[]>('get_user_activity');
      set({ userActivity, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  addUser: async (user: NewUser) => {
    try {
      set({ loading: true, error: null });
      await invoke('add_user', { user });
      const users = await invoke<User[]>('get_all_users');
      set({ users, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  updateUser: async (id: number, user: UpdateUser) => {
    try {
      set({ loading: true, error: null });
      await invoke('update_user', { id, user });
      const users = await invoke<User[]>('get_all_users');
      set({ users, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
  
  deleteUser: async (id: number) => {
    try {
      set({ loading: true, error: null });
      await invoke('delete_user', { id });
      const users = await invoke<User[]>('get_all_users');
      set({ users, loading: false });
    } catch (error) {
      set({ error: String(error), loading: false });
    }
  },
}));
