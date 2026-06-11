import { create } from 'zustand';
import type { CheckHistory, InteractionPrediction } from '@/types';

interface MedSafeStore {
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Interaction State
  currentDrug: string;
  currentFood: string;
  setCurrentDrug: (drug: string) => void;
  setCurrentFood: (food: string) => void;

  // Results State
  latestResult: InteractionPrediction | null;
  setLatestResult: (result: InteractionPrediction | null) => void;

  // History State
  history: CheckHistory[];
  setHistory: (history: CheckHistory[]) => void;
  addToHistory: (item: CheckHistory) => void;

  // Error State
  error: string | null;
  setError: (error: string | null) => void;

  // Toast State
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const useMedSafeStore = create<MedSafeStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  currentDrug: '',
  currentFood: '',
  setCurrentDrug: (drug) => set({ currentDrug: drug }),
  setCurrentFood: (food) => set({ currentFood: food }),

  latestResult: null,
  setLatestResult: (result) => set({ latestResult: result }),

  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (item) => set((state) => ({ history: [item, ...state.history] })),

  error: null,
  setError: (error) => set({ error }),

  showToast: (message, type) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Will be integrated with sonner toast
  },
}));
