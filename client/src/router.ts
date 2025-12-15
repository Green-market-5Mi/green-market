import { renderDashboard } from './pages/dashboard'
import { renderOrders } from './pages/orders'
import { renderStocks } from './pages/stocks'
import { renderStats } from './pages/stats'

export type PageId = 'dashboard' | 'orders' | 'stocks' | 'stats'

const routes: Record<PageId, () => string> = {
  dashboard: renderDashboard,
  orders: renderOrders,
  stocks: renderStocks,
  stats: renderStats,
}

export function renderPage(page: PageId): void {
  const main = document.querySelector<HTMLElement>('#main-content')
  if (!main) throw new Error('#main-content not found')

  main.innerHTML = routes[page]()

  // nav active
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((btn) => {
    btn.classList.toggle('nav-link--active', btn.dataset.nav === page)
  })
}

export function initRouter(): void {
  // click nav
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nav as PageId | undefined
      if (!target) return
      renderPage(target)
    })
  })

  // default page
  renderPage('dashboard')
}
