import { usePortfolioStore } from '../state/portfolioStore'
import { format } from 'date-fns'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export function PortfolioPage() {
  const { positions, totalValueEUR, dailyChangePct } = usePortfolioStore()

  const labels = positions.map((p) => p.ticker)
  const values = positions.map((p) => Math.round(p.currentPriceEUR * p.quantity))

  return (
    <div className="container-p space-y-4 py-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Portafoglio</h1>
        <p className="text-sm text-muted">Aggiornato {format(new Date(), 'dd/MM/yyyy')}</p>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <Kpi label="Valore" value={`€ ${totalValueEUR.toLocaleString()}`} />
        <Kpi label="Giorno" value={`${dailyChangePct.toFixed(2)}%`} />
        <Kpi label="Posizioni" value={`${positions.length}`} />
      </section>

      <section className="bg-card rounded-xl p-3 shadow-sm">
        <Line
          data={{
            labels,
            datasets: [
              { label: 'Valore', data: values, borderColor: '#0369a1', backgroundColor: '#bae6fd' },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </section>

      <section>
        <h2 className="font-medium mb-2">Posizioni</h2>
        <ul className="divide-y divide-neutral-200 bg-card rounded-xl overflow-hidden">
          {positions.map((p) => (
            <li key={p.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{p.ticker}</div>
                <div className="text-xs text-muted">{p.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">€ {(p.currentPriceEUR * p.quantity).toLocaleString()}</div>
                <div className={`text-xs ${(p.changePctDay ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(p.changePctDay ?? 0).toFixed(2)}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl p-3 text-center shadow-sm">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}