import { Personnage } from '../provider.js';

export function renderFavoris(content) {
  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]'); // Récupérer les favoris depuis localStorage
  Personnage.fetchAll().then(personnages => {
    // Filtrer les personnages pour ne garder que ceux qui sont dans les favoris
    const favPersos = personnages.filter(p => favoris.includes(p.id.toString())); // Assurez-vous que les ID sont comparés en tant que chaînes

    if (favPersos.length === 0) {
      content.innerHTML = `<p>Aucun favori pour l’instant.</p>`;
      return;
    }

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
          ${favPersos.map(p => `
            <div class="hero-card">
              <a href="#detail/${p.id}">
                <img loading="lazy" src="${p.image}" alt="${p.nom}">
                <p class="hero-name">${p.nom}</p>
              </a>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // Recherche par nom
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filteredPersonnages = favPersos.filter(p => p.nom.toLowerCase().includes(query));
      renderFilteredList();
    });

    // Filtrage par rôle
    document.getElementById('roleFilter').addEventListener('change', (e) => {
      const role = e.target.value;
      if (role === 'all') {
        filteredPersonnages = [...favPersos];
      } else {
        filteredPersonnages = favPersos.filter(p => p.role === role);
      }
      renderFilteredList();
    });

    // Tri alphabétique
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
    console.error('Erreur lors du chargement des personnages :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement des favoris.</p>`;
  });
}