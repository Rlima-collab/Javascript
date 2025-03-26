import { Personnage } from '../provider.js';

export function renderListe(content, page = 1) {
  
  Personnage.fetchAll(page).then(personnages => {
  content.innerHTML = `
    <h2>Liste des Personnages</h2>
    <input type="text" id="search" placeholder="Rechercher un personnage">
    <div class="card-list" id="liste">
    ${personnages.map(p => `
      <a href="#detail/${p.id}">
      <div class="card">
      <img loading="lazy" src="${p.image}" alt="${p.nom}">
      <p id="nom"> ${p.nom}</p>
      <p>Rôle: ${p.role}</p>
      </div>
      </a>
    `).join('')}
    </div>
    <div class="pagination">
    <button id="prev">Précédent</button>
    <button id="next">Suivant</button>
    </div>
  `;
  document.getElementById('prev').addEventListener('click', () => {
    if (page > 1) renderListe(content, page - 1);
  });
  document.getElementById('next').addEventListener('click', () => {
    renderListe(content, page + 1);
  });
  document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = personnages.filter(p => p.nom.toLowerCase().includes(query));
    document.getElementById('liste').innerHTML = filtered.map(p => `
    <a href="#detail/${p.id}">
    <div class="card">
      <img loading="lazy" src="${p.image}" alt="${p.nom}">
      <p id="nom"> ${p.nom}</p>
      <p>Rôle: ${p.role}</p>
    </div>
    </a>
    `).join('');
  });
  });
}
