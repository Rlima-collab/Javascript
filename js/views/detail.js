import { Personnage } from '../provider.js';

export function renderDetail(content, id) {
  Personnage.fetchById(id).then(p => {
    const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    const isFav = favoris.includes(p.id);
    content.innerHTML = `
      <div class="detail">
        <h2>${p.nom}</h2>
        <img loading="lazy" src="${p.image}" alt="${p.nom}">
        <p><strong>Rôle:</strong> ${p.role}</p>
        <p><strong>Description:</strong> ${p.description}</p>
        <p><strong>Équipements:</strong> ${p.equipements.length ? p.equipements.join(', ') : 'Aucun'}</p>
        <p><strong>Note:</strong> <span id="note">${p.note}</span>/5</p>
        <input type="number" id="newNote" min="0" max="5" value="${p.note}">
        <button id="save">Noter</button>
        <button id="fav">${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
        <br>
        <a href="#liste">Retour à la liste</a>
      </div>
    `;
    document.getElementById('save').addEventListener('click', () => {
      const note = document.getElementById('newNote').value;
      Personnage.updateNote(id, note).then(() => {
        document.getElementById('note').textContent = note;
      });
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
  });
}