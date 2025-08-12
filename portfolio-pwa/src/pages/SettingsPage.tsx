import { usePortfolioStore } from '../state/portfolioStore'

export function SettingsPage() {
  const { reset } = usePortfolioStore()

  return (
    <div className="container-p py-4 space-y-4">
      <h1 className="text-xl font-semibold">Impostazioni</h1>

      <section className="bg-card rounded-xl p-3 shadow-sm space-y-3">
        <button
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          onClick={() => document.documentElement.classList.toggle('dark')}
        >
          Toggle tema scuro/chiaro
        </button>
        <button
          className="w-full rounded-lg bg-red-600 text-white px-3 py-2"
          onClick={() => reset()}
        >
          Resetta dati locali
        </button>
      </section>

      <p className="text-xs text-muted">PWA: può funzionare offline, aggiungila alla schermata Home.</p>
    </div>
  )
}