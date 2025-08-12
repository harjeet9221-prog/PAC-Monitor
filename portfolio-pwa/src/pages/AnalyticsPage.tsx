import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { usePortfolioStore } from '../state/portfolioStore'

ChartJS.register(ArcElement, Tooltip, Legend)

export function AnalyticsPage() {
  const { allocationByAssetClass } = usePortfolioStore()

  const labels = Object.keys(allocationByAssetClass)
  const values = Object.values(allocationByAssetClass)

  return (
    <div className="container-p py-4 space-y-4">
      <h1 className="text-xl font-semibold">Analisi</h1>

      <section className="bg-card rounded-xl p-3 shadow-sm">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: ['#0284c7', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'],
              },
            ],
          }}
          options={{ plugins: { legend: { position: 'bottom' } } }}
        />
      </section>

      <section className="grid grid-cols-2 gap-2">
        <Metric label="Volatilità 1Y" value={`${(Math.random() * 15 + 5).toFixed(2)}%`} />
        <Metric label="Sharpe 1Y" value={`${(Math.random() * 1.2 + 0.3).toFixed(2)}`} />
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl p-3 text-center shadow-sm">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}