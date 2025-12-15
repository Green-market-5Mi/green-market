export function renderDashboard(): string {
  return `
    <section class="page page--active">
      <h1 class="page-title">Tableau de bord</h1>

      <div class="cards-grid">
        <div class="card card-kpi">
          <div class="card-kpi-label">En attente</div>
          <div class="card-kpi-value">2</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">En préparation</div>
          <div class="card-kpi-value">1</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Expédiées aujourd'hui</div>
          <div class="card-kpi-value">0</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">Stock faible</div>
          <div class="card-kpi-value">3</div>
        </div>
        <div class="card card-kpi">
          <div class="card-kpi-label">CA total</div>
          <div class="card-kpi-value">186.80€</div>
        </div>
      </div>

      <div class="two-columns">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Commandes récentes</h2>
          </div>

          <ul class="list-orders">
            <li class="order-row">
              <div>
                <div class="order-id">CMD-2024-006</div>
                <div class="order-customer">Thomas Rousseau · 15/12 11:45</div>
              </div>
              <div class="order-right">
                <span class="badge badge--pending">En attente</span>
                <span class="order-amount">45.10€</span>
              </div>
            </li>

            <li class="order-row">
              <div>
                <div class="order-id">CMD-2024-002</div>
                <div class="order-customer">Jean Dupont · 15/12 10:15</div>
              </div>
              <div class="order-right">
                <span class="badge badge--preparing">En préparation</span>
                <span class="order-amount">29.40€</span>
              </div>
            </li>

            <li class="order-row">
              <div>
                <div class="order-id">CMD-2024-001</div>
                <div class="order-customer">Sophie Martin · 15/12 09:30</div>
              </div>
              <div class="order-right">
                <span class="badge badge--pending">En attente</span>
                <span class="order-amount">29.90€</span>
              </div>
            </li>

            <li class="order-row">
              <div>
                <div class="order-id">CMD-2024-003</div>
                <div class="order-customer">Marie Leclerc · 14/12 15:20</div>
              </div>
              <div class="order-right">
                <span class="badge badge--shipped">Expédiée</span>
                <span class="order-amount">24.00€</span>
              </div>
            </li>

            <li class="order-row">
              <div>
                <div class="order-id">CMD-2024-004</div>
                <div class="order-customer">Pierre Bernard · 14/12 12:00</div>
              </div>
              <div class="order-right">
                <span class="badge badge--shipped">Expédiée</span>
                <span class="order-amount">45.40€</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Alertes stock</h2>
          </div>

          <ul class="list-alerts">
            <li class="alert-row">
              <div>
                <div class="alert-name">Confiture fraise bio 250g</div>
                <div class="alert-sku">SKU: JAM-001</div>
              </div>
              <div class="alert-right">
                <span class="badge badge--low-stock">Stock faible</span>
                <span class="alert-stock">5 / 15</span>
              </div>
            </li>

            <li class="alert-row">
              <div>
                <div class="alert-name">Huile d'olive bio 500ml</div>
                <div class="alert-sku">SKU: OIL-001</div>
              </div>
              <div class="alert-right">
                <span class="badge badge--low-stock">Stock faible</span>
                <span class="alert-stock">8 / 10</span>
              </div>
            </li>

            <li class="alert-row">
              <div>
                <div class="alert-name">Miel de lavande 250g</div>
                <div class="alert-sku">SKU: HON-001</div>
              </div>
              <div class="alert-right">
                <span class="badge badge--low-stock">Stock faible</span>
                <span class="alert-stock">12 / 15</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `
}
