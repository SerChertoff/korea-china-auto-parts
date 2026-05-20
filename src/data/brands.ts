import type { VehicleBrand } from '../types'

/** 12 брендов авто: Корея + Китай (логотипы — CSS-плейсхолдер по полю logoPlaceholder) */
export const VEHICLE_BRANDS: VehicleBrand[] = [
  { id: 'hyundai', name: 'Hyundai', country: 'KR', logoPlaceholder: 'H' },
  { id: 'kia', name: 'Kia', country: 'KR', logoPlaceholder: 'K' },
  { id: 'genesis', name: 'Genesis', country: 'KR', logoPlaceholder: 'G' },
  { id: 'ssangyong', name: 'SsangYong', country: 'KR', logoPlaceholder: 'S' },
  { id: 'daewoo', name: 'Daewoo', country: 'KR', logoPlaceholder: 'D' },
  { id: 'chery', name: 'Chery', country: 'CN', logoPlaceholder: 'C' },
  { id: 'geely', name: 'Geely', country: 'CN', logoPlaceholder: 'Ge' },
  { id: 'haval', name: 'Haval', country: 'CN', logoPlaceholder: 'Ha' },
  { id: 'greatwall', name: 'Great Wall', country: 'CN', logoPlaceholder: 'GW' },
  { id: 'byd', name: 'BYD', country: 'CN', logoPlaceholder: 'B' },
  { id: 'changan', name: 'Changan', country: 'CN', logoPlaceholder: 'Ch' },
  { id: 'exeed', name: 'Exeed', country: 'CN', logoPlaceholder: 'E' },
]
