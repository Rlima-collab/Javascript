import { Personnage } from '../provider.js';

export function renderFavoris(content) {

  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
  console.log('Favoris dans localStorage :', favoris); // Vérifiez les favoris


  Personnage.fetchAll().then(personnages => {
    let favPersos = personnages.filter(p => favoris.includes(String(p.id)));
    console.log('Personnages favoris filtrés :', favPersos); // Vérifiez les personnages favoris

    let filteredPersonnages = [...favPersos];
    let isSortedAsc = true;

    function renderFilteredList() {
      document.getElementById('liste').innerHTML = filteredPersonnages.map(p => `
        <div class="hero-card">
          <a href="#detail/${p.id}">
            <img loading="lazy" src="${p.image}" alt="${p.nom}">
            <p class="hero-name">${p.nom}</p>
          </a>
        </div>
      `).join('');
    }

    content.innerHTML = `
      <section class="hero-selection">
        <h2>Mes Favoris</h2>
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
        <div class="hero-grid" id="liste">
          ${favPersos.length ? favPersos.map(p => `
            <div class="hero-card">
              <a href="#detail/${p.id}">
                <img loading="lazy" src="${p.image}" alt="${p.nom}">
                <p class="hero-name">${p.nom}</p>
              </a>
            </div>
          `).join('') : '<p>Aucun favori pour l’instant.</p>'}
        </div>
      </section>
    `;

    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filteredPersonnages = favPersos.filter(p => p.nom.toLowerCase().includes(query));
      renderFilteredList();
    });

    document.getElementById('roleFilter').addEventListener('change', (e) => {
      const role = e.target.value;
      if (role === 'all') {
        filteredPersonnages = [...favPersos];
      } else {
        filteredPersonnages = favPersos.filter(p => p.role === role);
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

    renderFilteredList();
  }).catch(error => {
    console.error('Erreur lors du chargement des personnages pour les favoris :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement des favoris.</p>`;
  });
}