import { Personnage } from '../provider.js';
import { ENDPOINT } from '../config.js';

export function renderDetail(content, id) {
  Promise.all([
    Personnage.fetchById(id),
    fetch(`${ENDPOINT}/equipements`).then(res => res.json()) // Récupération des équipements
  ]).then(([p, equipements]) => {
    console.log('Personnage:', p); // Vérifiez les données du personnage
    console.log('Équipements récupérés:', equipements); // Vérifiez les équipements récupérés

    if (!equipements || !Array.isArray(equipements)) {
      console.error('Les équipements ne sont pas disponibles ou ont un format incorrect.');
      content.innerHTML = `<p>Impossible de charger les équipements.</p>`;
      return;
    }

    const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    const isFav = favoris.includes(p.id);

    // Associer les noms des équipements
    const equipementNoms = p.equipements
      .map(equipId => {
        const equip = equipements.find(e => e.id === equipId); // Comparaison stricte
        console.log(equip);
        console.log(`Recherche équipement ID ${equipId}:`, equip); // Vérifiez chaque correspondance
        return equip ? equip.nom : 'Inconnu';
      })
      .join(', ');

    content.innerHTML = `
      <div class="detail">
        <h2>${p.nom}</h2>
        <img loading="lazy" src="${p.image}" alt="${p.nom}">
        <p><strong>Rôle:</strong> ${p.role}</p>
        <p><strong>Description:</strong> ${p.description}</p>
        <p><strong>Équipements:</strong> ${equipementNoms || 'Aucun'}</p>
        <p><strong>Note:</strong> <span id="note">${p.note}</span>/5</p>
        <input type="number" id="newNote" min="0" max="5" value="${p.note}">
        <button id="save">Noter</button>
        <button id="fav">${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
        <br>
        <a href="#liste">Retour à la liste</a>
      </div>
    `;

    const saveNote = () => {
      let note = document.getElementById('newNote').value;
      if (note > 5) {
      note = 5;
      } else if (note < 0) {
      note = 0;
      }
      console.log('Nouvelle note:', note);
      Personnage.updateNote(id, note).then(() => {
      document.getElementById('note').textContent = note;
      document.getElementById('newNote').value = '';
      });
    };

    document.getElementById('save').addEventListener('click', saveNote);

    document.getElementById('newNote').addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
      saveNote();
      }
    });

    document.getElementById('fav').addEventListener('click', () => {
      if (isFav) {
        localStorage.setItem('favoris', JSON.stringify(favoris.filter(f => f !== p.id)));
      } else {
        favoris.push(p.id);
        localStorage.setItem('favoris', JSON.stringify(favoris));
      }
      renderDetail(content, id);
    });
  }).catch(error => {
    console.error('Erreur lors de la récupération des données :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement des détails.</p>`;
  });
}