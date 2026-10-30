import { create } from 'zustand';
import { PelangganWithDetails } from '@/types/customer.types';
import { INITIAL_PELANGGAN_LIST } from '@/constants/pelanggan-constants';

interface PelangganStoreState {
  pelangganList: PelangganWithDetails[];
  addPelanggan: (newPelanggan: PelangganWithDetails) => void;
  getPelangganById: (id: string) => PelangganWithDetails | undefined;
}

export const usePelangganStore = create<PelangganStoreState>((set, get) => ({
  pelangganList: INITIAL_PELANGGAN_LIST,
  addPelanggan: (newPelanggan) =>
    set((state) => ({
      pelangganList: [newPelanggan, ...state.pelangganList],
    })),
  getPelangganById: (id) =>
    get().pelangganList.find((item) => item.id_pelanggan === id),
}));

