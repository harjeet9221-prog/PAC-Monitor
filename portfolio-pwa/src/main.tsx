import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SearchPage } from './pages/SearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { registerSW } from 'virtual:pwa-register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <PortfolioPage /> },
      { path: 'ricerca', element: <SearchPage /> },
      { path: 'analisi', element: <AnalyticsPage /> },
      { path: 'impostazioni', element: <SettingsPage /> },
    ],
  },
])

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
