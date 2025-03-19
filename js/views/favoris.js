import { Personnage } from '../provider.js';

export function renderFavoris(content) {
  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
  Personnage.fetchAll().then(personnages => {
    const favPersos = personnages.filter(p => favoris.includes(p.id));
    content.innerHTML = `
      <h2>Mes Favoris</h2>
      <div class="card-list">
        ${favPersos.length ? favPersos.map(p => `
          <div class="card">
            <img loading="lazy" src="${p.image}" alt="${p.nom}">
            <a href="#detail/${p.id}">${p.nom}</a>
            <p>Rôle: ${p.role}</p>
          </div>
        `).join('') : '<p>Aucun favori pour l’instant.</p>'}
      </div>
      <a href="#liste">Retour à la liste</a>
    `;
  });
}