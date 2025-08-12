import { create } from 'zustand'
import Dexie, { type Table } from 'dexie'

export type Position = {
  id: string
  ticker: string
  name: string
  quantity: number
  averagePriceEUR: number
  currentPriceEUR: number
  assetClass: 'Azioni' | 'Obbligazioni' | 'Metalli' | 'Liquidità' | 'Altro'
  changePctDay?: number
}

class PortfolioDB extends Dexie {
  positions!: Table<Position, string>
  constructor() {
    super('portfolio-db')
    this.version(1).stores({ positions: 'id,ticker' })
  }
}

const db = new PortfolioDB()

type PortfolioState = {
  positions: Position[]
  addPosition: (p: Position) => Promise<void>
  updatePrices: (updates: { id: string; currentPriceEUR: number; changePctDay?: number }[]) => Promise<void>
  reset: () => Promise<void>
  totalValueEUR: number
  dailyChangePct: number
  allocationByAssetClass: Record<string, number>
}

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  positions: [],
  addPosition: async (p) => {
    await db.positions.put(p)
    set((s) => ({ positions: [...s.positions, { ...p, currentPriceEUR: p.currentPriceEUR, changePctDay: 0 }] }))
  },
  updatePrices: async (updates) => {
    for (const u of updates) {
      await db.positions.update(u.id, { currentPriceEUR: u.currentPriceEUR, changePctDay: u.changePctDay })
    }
    set((s) => ({
      positions: s.positions.map((p) => {
        const u = updates.find((x) => x.id === p.id)
        return u ? { ...p, currentPriceEUR: u.currentPriceEUR, changePctDay: u.changePctDay } : p
      }),
    }))
  },
  reset: async () => {
    await db.delete();
    set({ positions: [] })
  },
  get totalValueEUR() {
    return get().positions.reduce((sum, p) => sum + p.currentPriceEUR * p.quantity, 0)
  },
  get dailyChangePct() {
    const positions = get().positions
    if (positions.length === 0) return 0
    const total = get().totalValueEUR
    const delta = positions.reduce((acc, p) => acc + (p.changePctDay || 0) * (p.currentPriceEUR * p.quantity) / 100, 0)
    return (delta / total) * 100
  },
  get allocationByAssetClass() {
    const total = get().totalValueEUR || 1
    const map: Record<string, number> = {}
    for (const p of get().positions) {
      const value = p.currentPriceEUR * p.quantity
      map[p.assetClass] = (map[p.assetClass] || 0) + value
    }
    Object.keys(map).forEach((k) => (map[k] = Math.round((map[k] / total) * 100)))
    return map
  },
}))

// Load initial data from IndexedDB
;(async () => {
  const items = await db.positions.toArray()
  if (items.length) {
    usePortfolioStore.setState({ positions: items })
  }
})()