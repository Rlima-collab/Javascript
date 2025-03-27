import { Personnage } from '../provider.js';

export function renderListe(content, page = 1) {
  Personnage.fetchAll(page).then(personnages => {
    let filteredPersonnages = [...personnages];
    let isSortedAsc = true;

    function renderFilteredList() {
      document.getElementById('liste').innerHTML = filteredPersonnages.map(p => `
        <div class="card">
          <img loading="lazy" src="${p.image}" alt="${p.nom}">
          <a href="#detail/${p.id}">${p.nom}</a>
          <p>Rôle: ${p.role}</p>
        </div>
      `).join('');
    }

    content.innerHTML = `
      <h2>Liste des Personnages</h2>
      <div class="filters">
        <input type="text" id="search" placeholder="Rechercher un personnage">
        <select id="roleFilter">
          <option value="all">Tous les rôles</option>
          <option value="Tank">Tank</option>
          <option value="Dégâts">Dégâts</option>
          <option value="Soins">Soins</option>
        </select>
        <button id="sortAlpha">Trier A-Z</button>
      </div>
      <div class="card-list" id="liste">
        ${filteredPersonnages.map(p => `
          <div class="card">
            <img loading="lazy" src="${p.image}" alt="${p.nom}">
            <a href="#detail/${p.id}">${p.nom}</a>
            <p>Rôle: ${p.role}</p>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filteredPersonnages = personnages.filter(p => p.nom.toLowerCase().includes(query));
      renderFilteredList();
    });

    document.getElementById('roleFilter').addEventListener('change', (e) => {
      const role = e.target.value;
      if (role === 'all') {
        filteredPersonnages = [...personnages];
      } else {
        filteredPersonnages = personnages.filter(p => p.role === role);
      }
      renderFilteredList();
    });

    document.getElementById('sortAlpha').addEventListener('click', () => {
      if (isSortedAsc) {
        filteredPersonnages.sort((a, b) => a.nom.localeCompare(b.nom));
      } else {
        filteredPersonnages.sort((a, b) => b.nom.localeCompare(a.nom));
      }
      isSortedAsc = !isSortedAsc;
      renderFilteredList();
    });
  });
}