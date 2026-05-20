import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SelectedVehicle } from '../types'

interface VehicleState {
  vehicle: SelectedVehicle | null
  setVehicle: (v: SelectedVehicle | null) => void
}

/** «Мой автомобиль» в шапке — сохраняем в localStorage */
export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicle: null,
      setVehicle: (vehicle) => set({ vehicle }),
    }),
    { name: 'kr-cn-vehicle' },
  ),
)
