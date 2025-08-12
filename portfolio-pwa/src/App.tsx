import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Settings, Wallet, Search } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1 pb-20 safe-top">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 safe-bottom bg-card border-t border-neutral-200">
        <div className="grid grid-cols-4 text-sm">
          <Tab to="/" icon={<Wallet size={22} />} label="Portaf." />
          <Tab to="/ricerca" icon={<Search size={22} />} label="Ricerca" />
          <Tab to="/analisi" icon={<BarChart3 size={22} />} label="Analisi" />
          <Tab to="/impostazioni" icon={<Settings size={22} />} label="Impost." />
        </div>
      </nav>
    </div>
  )
}

function Tab({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 py-2 ${isActive ? 'text-primary' : 'text-neutral-600'}`
      }
    >
      {icon}
      <span className="text-[11px]">{label}</span>
    </NavLink>
  )
}
