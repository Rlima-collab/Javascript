import { Personnage } from '../provider.js';

export function renderFavoris(content) {
  // Récupération des favoris depuis le localStorage
  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
  console.log('Favoris dans localStorage :', favoris); // Vérifiez les favoris dans la console

  // Récupération de tous les personnages depuis l'API
  Personnage.fetchAll().then(personnages => {
    // Filtrer les personnages pour ne garder que ceux qui sont dans les favoris
    let favPersos = personnages.filter(p => favoris.includes(String(p.id)));
    console.log('Personnages favoris filtrés :', favPersos);

    // Liste des personnages filtrés (initialement tous les favoris)
    let filteredPersonnages = [...favPersos];
    let isSortedAsc = true; // Indicateur pour le tri alphabétique (ascendant ou descendant)

    // Fonction pour afficher la liste filtrée des personnages
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
          <!-- Champ de recherche -->
          <input type="text" id="search" placeholder="Rechercher un personnage">
          <!-- Filtre par rôle -->
          <select id="roleFilter">
            <option value="all">Tous les rôles</option>
            <option value="Tank">Tank</option>
            <option value="Dégâts">Dégâts</option>
            <option value="Soins">Soins</option>
          </select>
          <!-- Bouton pour trier les personnages -->
          <button id="sortAlpha">Trier A-Z</button>
        </div>
        <!-- Grille des personnages favoris -->
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

    // Gestion de la recherche par nom
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase(); // Récupérer la valeur saisie
      // Filtrer les personnages favoris en fonction de la recherche
      filteredPersonnages = favPersos.filter(p => p.nom.toLowerCase().includes(query));
      renderFilteredList(); // Mettre à jour l'affichage
    });

    // Gestion du filtre par rôle
    document.getElementById('roleFilter').addEventListener('change', (e) => {
      const role = e.target.value; // Récupérer le rôle sélectionné
      if (role === 'all') {
        // Si "Tous les rôles" est sélectionné, afficher tous les favoris
        filteredPersonnages = [...favPersos];
      } else {
        // Sinon, filtrer les personnages par rôle
        filteredPersonnages = favPersos.filter(p => p.role === role);
      }
      renderFilteredList(); // Mettre à jour l'affichage
    });

    // Gestion du tri alphabétique
    document.getElementById('sortAlpha').addEventListener('click', () => {
      if (isSortedAsc) {
        // Trier par ordre alphabétique ascendant
        filteredPersonnages.sort((a, b) => a.nom.localeCompare(b.nom));
      } else {
        // Trier par ordre alphabétique descendant
        filteredPersonnages.sort((a, b) => b.nom.localeCompare(a.nom));
      }
      isSortedAsc = !isSortedAsc; // Inverser l'ordre de tri pour le prochain clic
      renderFilteredList(); // Mettre à jour l'affichage
    });

    renderFilteredList();
  }).catch(error => {
    console.error('Erreur lors du chargement des personnages pour les favoris :', error);
    content.innerHTML = `<p>Une erreur est survenue lors du chargement des favoris.</p>`;
  });
}