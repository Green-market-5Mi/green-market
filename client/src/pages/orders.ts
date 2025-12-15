export function renderOrders(): string {
  return `
    <section class="page page--active">
      <h1 class="page-title">Commandes</h1>

      <div class="toolbar">
        <input
          type="search"
          class="search-input"
          placeholder="Rechercher par numéro, client, email..."
          aria-label="Rechercher une commande"
        />
        <div class="toolbar-filters">
          <button class="filter-pill filter-pill--active">Tous (6)</button>
          <button class="filter-pill">En attente (2)</button>
          <button class="filter-pill">En préparation (1)</button>
          <button class="filter-pill">Expédiées (2)</button>
        </div>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Transporteur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CMD-2024-001</td>
                <td>
                  <div class="table-main-text">Sophie Martin</div>
                  <div class="table-sub-text">sophie.martin@email.fr</div>
                </td>
                <td>15/12/2024 09:30</td>
                <td>29.90€</td>
                <td><span class="badge badge--pending">En attente</span></td>
                <td>–</td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>

              <tr>
                <td>CMD-2024-002</td>
                <td>
                  <div class="table-main-text">Jean Dupont</div>
                  <div class="table-sub-text">jean.dupont@email.fr</div>
                </td>
                <td>15/12/2024 10:15</td>
                <td>29.40€</td>
                <td><span class="badge badge--preparing">En préparation</span></td>
                <td>–</td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>

              <tr>
                <td>CMD-2024-003</td>
                <td>
                  <div class="table-main-text">Marie Leclerc</div>
                  <div class="table-sub-text">marie.leclerc@email.fr</div>
                </td>
                <td>14/12/2024 15:20</td>
                <td>24.00€</td>
                <td><span class="badge badge--shipped">Expédiée</span></td>
                <td>Colissimo<br /><span class="table-sub-text">8L12345678901</span></td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>

              <tr>
                <td>CMD-2024-004</td>
                <td>
                  <div class="table-main-text">Pierre Bernard</div>
                  <div class="table-sub-text">pierre.bernard@email.fr</div>
                </td>
                <td>14/12/2024 12:00</td>
                <td>45.40€</td>
                <td><span class="badge badge--shipped">Expédiée</span></td>
                <td>Mondial Relay<br /><span class="table-sub-text">MR9876543210</span></td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>

              <tr>
                <td>CMD-2024-005</td>
                <td>
                  <div class="table-main-text">Claire Moreau</div>
                  <div class="table-sub-text">claire.moreau@email.fr</div>
                </td>
                <td>13/12/2024 11:30</td>
                <td>13.00€</td>
                <td><span class="badge badge--delivered">Livrée</span></td>
                <td>Colissimo<br /><span class="table-sub-text">8L98765432109</span></td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>

              <tr>
                <td>CMD-2024-006</td>
                <td>
                  <div class="table-main-text">Thomas Rousseau</div>
                  <div class="table-sub-text">thomas.rousseau@email.fr</div>
                </td>
                <td>15/12/2024 11:45</td>
                <td>45.10€</td>
                <td><span class="badge badge--pending">En attente</span></td>
                <td>–</td>
                <td><button class="btn-ghost">Détails</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
}
