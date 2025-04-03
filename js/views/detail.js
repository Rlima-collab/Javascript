import { Personnage } from '../provider.js';
import { ENDPOINT } from '../config.js';

export function renderDetail(content, id) {
  // Récupération des données du personnage et des équipements en parallèle
  Promise.all([
    Personnage.fetchById(id), // Récupérer les détails du personnage par son ID
    fetch(`${ENDPOINT}/equipements`).then(res => res.json()) // Récupérer la liste des équipements
  ]).then(([p, equipements]) => {
    console.log('Personnage:', p); // Vérifiez les données du personnage dans la console
    console.log('Équipements récupérés:', equipements); // Vérifiez les équipements récupérés dans la console

    // Vérification si les équipements sont disponibles et valides
    if (!equipements || !Array.isArray(equipements)) {
      console.error('Les équipements ne sont pas disponibles ou ont un format incorrect.');
      content.innerHTML = `<p>Impossible de charger les équipements.</p>`;
      return;
    }

    // Gestion des favoris : récupération depuis le localStorage
    const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    const isFav = favoris.includes(p.id); // Vérifie si le personnage est dans les favoris

    // Associer les noms des équipements au personnage
    const equipementNoms = p.equipements
      .map(equipId => {
        const equip = equipements.find(e => parseInt(e.id, 10) === equipId); // Trouver l'équipement correspondant
        return equip ? equip.nom : 'Inconnu'; // Si l'équipement n'est pas trouvé, afficher "Inconnu"
      })
      .join(', ');

    // Génération du contenu HTML pour afficher les détails du personnage
    content.innerHTML = `
      <div class="detail">
        <h2>${p.nom}</h2>
        <img loading="lazy" src="${p.image}" alt="${p.nom}">
        <p><strong>Rôle:</strong> ${p.role}</p>
        <p><strong>Description:</strong> ${p.description}</p>
        <p><strong>Équipements:</strong> ${equipementNoms || 'Aucun'}</p>
        <p><strong>Points:</strong> ${p.points}</p>
        <p><strong>Combats:</strong> ${p.combats}</p>
        <p><strong>Note:</strong> <span id="note" class="note-display">${p.note}</span>/5</p>
        <div class="note-input">
          <input type="number" id="newNote" min="0" max="5" value="${p.note}">
          <button id="save" class="btn btn-primary">Noter</button>
        </div>
        <button id="fav" class="btn btn-primary">${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
        <div class="detail-footer">
          <a href="#liste" class="btn btn-primary">Retour à la liste</a>
        </div>
      </div>
    `;

    const saveNote = () => {
      let note = document.getElementById('newNote').value; // Récupérer la nouvelle note
      if (note > 5) {
        note = 5; // Limiter la note à 5
      } else if (note < 0) {
        note = 0; // Limiter la note à 0
      }
      console.log('Nouvelle note:', note);
      Personnage.updateNote(id, note).then(() => {
        document.getElementById('note').textContent = note; // Mettre à jour l'affichage de la note
        document.getElementById('newNote').value = ''; // Réinitialiser le champ de saisie
      });
    };

    // Gestion du clic sur le bouton "Noter"
    document.getElementById('save').addEventListener('click', saveNote);

    // Gestion de la saisie avec la touche "Entrée" pour sauvegarder la note
    document.getElementById('newNote').addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        saveNote();
      }
    });

    // Gestion du clic sur le bouton "Ajouter/Retirer des favoris"
    document.getElementById('fav').addEventListener('click', () => {
      if (isFav) {
        // Retirer des favoris
        localStorage.setItem('favoris', JSON.stringify(favoris.filter(f => f !== p.id)));
      } else {
        // Ajouter aux favoris
        favoris.push(p.id);
        localStorage.setItem('favoris', JSON.stringify(favoris));
      }
      renderDetail(content, id); // Recharger les détails pour mettre à jour l'état du bouton
    });
  }).catch(error => {
    // Gestion des erreurs lors de la récupération des données
    console.error('Erreur lors de la récupération des données :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement des détails.</p>`;
  });
}