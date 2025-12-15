import './style.css'
import { initRouter } from './router'

function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) throw new Error('Root element "#app" not found')

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-left">
          <div class="brand-icon">GM</div>
          <div>
            <div class="brand-title">Green Market</div>
            <div class="brand-subtitle">Gestion des commandes</div>
          </div>
        </div>
        <div class="topbar-right">
          <span class="user-role">Responsable e-commerce</span>
          <div class="user-pill">Admin</div>
        </div>
      </header>

      <div class="layout">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <button class="nav-link nav-link--active" data-nav="dashboard">
              <span class="nav-dot"></span> Tableau de bord
            </button>
            <button class="nav-link" data-nav="orders">
              <span class="nav-dot"></span> Commandes
            </button>
            <button class="nav-link" data-nav="stocks">
              <span class="nav-dot"></span> Stocks
            </button>
            <button class="nav-link" data-nav="stats">
              <span class="nav-dot"></span> Statistiques
            </button>
          </nav>
        </aside>

        <main class="main" id="main-content"></main>
      </div>
    </div>
  `

  initRouter()
}

initApp()