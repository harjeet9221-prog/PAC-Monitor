import { useState } from 'react'
import { usePortfolioStore } from '../state/portfolioStore'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const { addPosition } = usePortfolioStore()

  const results = MOCK_INSTRUMENTS.filter((i) =>
    i.ticker.toLowerCase().includes(query.toLowerCase()) ||
    i.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container-p py-4 space-y-3">
      <h1 className="text-xl font-semibold">Ricerca strumenti</h1>

      <input
        className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        placeholder="Cerca nome, ISIN o ticker"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="divide-y divide-neutral-200 bg-card rounded-xl overflow-hidden">
        {results.map((r) => (
          <li key={r.ticker} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.ticker}</div>
              <div className="text-xs text-muted">{r.name}</div>
            </div>
            <button
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm"
              onClick={() => addPosition({
                id: crypto.randomUUID(),
                ticker: r.ticker,
                name: r.name,
                quantity: 1,
                averagePriceEUR: r.priceEUR,
                currentPriceEUR: r.priceEUR,
                assetClass: r.assetClass,
              })}
            >
              Aggiungi
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const MOCK_INSTRUMENTS = [
  { ticker: 'VWCE', name: 'Vanguard FTSE All-World UCITS', priceEUR: 120, assetClass: 'Azioni' as const },
  { ticker: 'EMIM', name: 'iShares MSCI Emerging Markets IMI', priceEUR: 30, assetClass: 'Azioni' as const },
  { ticker: 'AGGH', name: 'iShares Core Global Aggregate Bond', priceEUR: 5, assetClass: 'Obbligazioni' as const },
  { ticker: 'GLDA', name: 'Invesco Physical Gold', priceEUR: 40, assetClass: 'Metalli' as const },
]