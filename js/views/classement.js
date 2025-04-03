import { Personnage } from '../provider.js';
import { ENDPOINT } from '../config.js';

export function renderClassement(content) {
  Personnage.fetchAll().then(personnages => {
    // Assurez-vous que les champs points et combats sont bien définis
    personnages.forEach(p => {
      p.points = p.points || 0; // Valeur par défaut si points est undefined
      p.combats = p.combats || 0; // Valeur par défaut si combats est undefined
    });

    // Trier les personnages par points décroissants
    personnages.sort((a, b) => b.points - a.points);

    // Générer le contenu HTML du classement
    content.innerHTML = `
      <section class="classement-section">
        <h2>Classement des Personnages</h2>
        <table class="classement-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom</th>
              <th>Points</th>
              <th>Combats</th>
            </tr>
          </thead>
          <tbody>
            ${personnages.map((p, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${p.nom}</td>
                <td>${p.points}</td>
                <td>${p.combats}</td>
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