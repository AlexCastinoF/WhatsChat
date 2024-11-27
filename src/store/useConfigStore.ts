import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WhatsAppConfig } from '../types/api';

interface ConfigStore {
  config: WhatsAppConfig | null;
  setConfig: (config: WhatsAppConfig) => void;
  clearConfig: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: null }),
    }),
    {
      name: 'whatsapp-config',
    }
  )
);