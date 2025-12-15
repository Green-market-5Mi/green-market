export function renderStats(): string {
  return `
    <section class="page page--active">
      <h1 class="page-title">Statistiques</h1>

      <div class="cards-grid">
        <div class="card card-kpi">
          <div class="card-kpi-label">Total commandes</div>
          <div class="card-kpi-value">6</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Chiffre d'affaires</div>
          <div class="card-kpi-value">187€</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Panier moyen</div>
          <div class="card-kpi-value">31.13€</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Taux de livraison</div>
          <div class="card-kpi-value">16.7%</div>
        </div>
      </div>

      <div class="stats-grid">
        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Évolution des commandes (7 jours)</h2>
          </header>
          <div class="chart chart-line-placeholder">
            <span>Graphique ligne (placeholder)</span>
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Répartition par statut</h2>
          </header>
          <div class="chart chart-pie">
            <div class="chart-pie-visual"></div>
            <ul class="chart-legend">
              <li><span class="legend-dot legend-dot--pending"></span>En attente (33%)</li>
              <li><span class="legend-dot legend-dot--preparing"></span>En préparation (17%)</li>
              <li><span class="legend-dot legend-dot--shipped"></span>Expédiée (33%)</li>
              <li><span class="legend-dot legend-dot--delivered"></span>Livrée (17%)</li>
            </ul>
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Top 5 produits (CA)</h2>
          </header>
          <div class="chart chart-bars">
            <div class="bar-row">
              <span class="bar-label">Thé vert bio 100g</span>
              <div class="bar-track"><div class="bar-fill" style="width: 90%"></div></div>
            </div>
            <div class="bar-row">
              <span class="bar-label">Café équitable 250g</span>
              <div class="bar-track"><div class="bar-fill" style="width: 80%"></div></div>
            </div>
            <div class="bar-row">
              <span class="bar-label">Miel de lavande 250g</span>
              <div class="bar-track"><div class="bar-fill" style="width: 60%"></div></div>
            </div>
            <div class="bar-row">
              <span class="bar-label">Chocolat noir 70% bio 100g</span>
              <div class="bar-track"><div class="bar-fill" style="width: 40%"></div></div>
            </div>
            <div class="bar-row">
              <span class="bar-label">Huile d'olive bio 500ml</span>
              <div class="bar-track"><div class="bar-fill" style="width: 30%"></div></div>
            </div>
          </div>
        </article>

        <article class="card">
          <header class="card-header">
            <h2 class="card-title">Répartition par transporteur</h2>
          </header>
          <div class="chart chart-pie">
            <div class="chart-pie-visual chart-pie-visual--two"></div>
            <ul class="chart-legend">
              <li><span class="legend-dot legend-dot--colissimo"></span>Colissimo (67%)</li>
              <li><span class="legend-dot legend-dot--mondial"></span>Mondial Relay (33%)</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  `
}
