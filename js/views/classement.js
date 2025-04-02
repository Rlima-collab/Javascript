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
        <button id="resetClassement" class="reset-button">Réinitialiser le Classement</button>
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

    // Ajouter un événement pour réinitialiser le classement
    document.getElementById('resetClassement').addEventListener('click', () => {
      resetClassement(personnages);
    });
  }).catch(error => {
    console.error('Erreur lors du chargement des personnages pour le classement :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement du classement.</p>`;
  });
}

function resetClassement(personnages) {
  const resetPromises = personnages.map(p => {
    // Réinitialiser les points, les combats et restaurer les équipements initiaux
    p.points = 0;
    p.combats = 0;

    // Restaurer les équipements initiaux sans modifier `equipementInitial`
    if (p.equipementInitial && Array.isArray(p.equipementInitial)) {
      p.equipements = [...p.equipementInitial];
    } else {
      p.equipements = []; // Si aucun équipement initial, on vide la liste
    }

    // Mettre à jour le personnage sur le serveur
    return fetch(`${ENDPOINT}/personnages/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...p,
        equipementInitial: [...p.equipementInitial] // Assurez-vous que `equipementInitial` reste intact
      })
    });
  });

  Promise.all(resetPromises)
    .then(() => {
      console.log('Classement réinitialisé avec succès.');
      alert('Le classement a été réinitialisé.');
      renderClassement(document.getElementById('content')); // Recharger le classement
    })
    .catch(error => {
      console.error('Erreur lors de la réinitialisation du classement :', error);
    });
}