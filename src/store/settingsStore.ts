import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  storeName: string;
  supportLine: string;
  address: string;
  maintenanceMode: boolean;
  guestCheckout: boolean;
  showReviews: boolean;
  autoCancel: boolean;
  updateSettings: (updates: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      storeName: 'CampusKit Stationery Hub',
      supportLine: '+91 98765 43210',
      address: 'Main Campus, Academic Block A, Level 1',
      maintenanceMode: false,
      guestCheckout: true,
      showReviews: true,
      autoCancel: false,
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'campus-kit-settings',
    }
  )
);
