import { create } from 'zustand';

interface UIState {
  isSettingsSubSidebarOpen: boolean;
  toggleSettingsSubSidebar: () => void;
  setSettingsSubSidebar: (isOpen: boolean) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (isLoggingOut: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsSubSidebarOpen: true,
  toggleSettingsSubSidebar: () => set((state) => ({ isSettingsSubSidebarOpen: !state.isSettingsSubSidebarOpen })),
  setSettingsSubSidebar: (isOpen: boolean) => set({ isSettingsSubSidebarOpen: isOpen }),
  isLoggingOut: false,
  setIsLoggingOut: (isLoggingOut: boolean) => set({ isLoggingOut }),
}));
