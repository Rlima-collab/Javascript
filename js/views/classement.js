import { Personnage } from '../provider.js';

export function renderClassement(content) {
  Personnage.fetchAll().then(personnages => {
    // Trier les personnages par points décroissants
    personnages.sort((a, b) => b.points - a.points);

    content.innerHTML = `
      <section class="classement-section">
        <h2>Classement des Personnages</h2>
        <table class="classement-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${personnages.map((p, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${p.nom}</td>
                <td>${p.points || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }).catch(error => {
    console.error('Erreur lors du chargement des personnages pour le classement :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement du classement.</p>`;
  });
}