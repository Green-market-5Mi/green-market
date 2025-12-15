export function renderStocks(): string {
  return `
    <section class="page page--active">
      <h1 class="page-title">Stocks</h1>

      <div class="cards-grid">
        <div class="card card-kpi">
          <div class="card-kpi-label">Total produits</div>
          <div class="card-kpi-value">8</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Stock faible</div>
          <div class="card-kpi-value">3</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Rupture de stock</div>
          <div class="card-kpi-value">0</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Valeur stock</div>
          <div class="card-kpi-value">2630.70€</div>
        </div>
      </div>

      <div class="toolbar">
        <input
          type="search"
          class="search-input"
          placeholder="Rechercher par nom ou SKU..."
          aria-label="Rechercher un produit"
        />
        <div class="toolbar-filters">
          <button class="filter-pill filter-pill--active">Tous</button>
          <button class="filter-pill">Stock faible</button>
          <button class="filter-pill">Stock OK</button>
        </div>
      </div>

      <div class="stock-grid">
        <article class="card stock-card stock-card--ok">
          <header class="stock-card-header">
            <div>
              <div class="stock-name">Thé vert bio 100g</div>
              <div class="stock-meta">SKU: TEA-001 · Prix: 8.50€</div>
            </div>
            <span class="badge badge--stock-ok">OK</span>
          </header>
          <div class="stock-bar">
            <div class="stock-bar-fill" style="width: 70%"></div>
          </div>
          <footer class="stock-footer">
            <span>Stock: <strong>45</strong> unités</span>
            <span>Seuil d'alerte: 20</span>
          </footer>
        </article>

        <article class="card stock-card stock-card--warning">
          <header class="stock-card-header">
            <div>
              <div class="stock-name">Miel de lavande 250g</div>
              <div class="stock-meta">SKU: HON-001 · Prix: 12.90€</div>
            </div>
            <span class="badge badge--low-stock">Faible</span>
          </header>
          <div class="stock-bar">
            <div class="stock-bar-fill stock-bar-fill--warning" style="width: 40%"></div>
          </div>
          <footer class="stock-footer">
            <span>Stock: <strong>12</strong> unités</span>
            <span>Seuil d'alerte: 15</span>
          </footer>
          <div class="stock-alert">
            Le stock est en dessous du seuil d'alerte. Pensez à réapprovisionner.
          </div>
        </article>

        <article class="card stock-card stock-card--ok">
          <header class="stock-card-header">
            <div>
              <div class="stock-name">Café équitable 250g</div>
              <div class="stock-meta">SKU: COF-001 · Prix: 9.80€</div>
            </div>
            <span class="badge badge--stock-ok">OK</span>
          </header>
          <div class="stock-bar">
            <div class="stock-bar-fill" style="width: 80%"></div>
          </div>
          <footer class="stock-footer">
            <span>Stock: <strong>67</strong> unités</span>
            <span>Seuil d'alerte: 25</span>
          </footer>
        </article>

        <article class="card stock-card stock-card--warning">
          <header class="stock-card-header">
            <div>
              <div class="stock-name">Huile d'olive bio 500ml</div>
              <div class="stock-meta">SKU: OIL-001 · Prix: 15.50€</div>
            </div>
            <span class="badge badge--low-stock">Faible</span>
          </header>
          <div class="stock-bar">
            <div class="stock-bar-fill stock-bar-fill--warning" style="width: 30%"></div>
          </div>
          <footer class="stock-footer">
            <span>Stock: <strong>8</strong> unités</span>
            <span>Seuil d'alerte: 10</span>
          </footer>
          <div class="stock-alert">
            Le stock est en dessous du seuil d'alerte. Pensez à réapprovisionner.
          </div>
        </article>
      </div>
    </section>
  `
}
