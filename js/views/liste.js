import { Personnage } from '../provider.js';

export function renderListe(content) {
    // Récupération de tous les personnages depuis l'API
    Personnage.fetchAll().then(personnages => {
        let filteredPersonnages = [...personnages]; // Liste des personnages filtrés (initialement tous)
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
            `).join(''); // Générer le HTML pour chaque personnage
        }

        content.innerHTML = `
            <section class="hero-selection">
                <h2>Liste des Personnages</h2>
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
                <!-- Grille des personnages -->
                <div class="hero-grid" id="liste">
                    ${filteredPersonnages.map(p => `
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

        // Gestion de la recherche par nom
        document.getElementById('search').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase(); // Récupérer la valeur saisie
            // Filtrer les personnages en fonction de la recherche
            filteredPersonnages = personnages.filter(p => p.nom.toLowerCase().includes(query));
            renderFilteredList(); // Mettre à jour l'affichage
        });

        // Gestion du filtre par rôle
        document.getElementById('roleFilter').addEventListener('change', (e) => {
            const role = e.target.value; // Récupérer le rôle sélectionné
            if (role === 'all') {
                // Si "Tous les rôles" est sélectionné, afficher tous les personnages
                filteredPersonnages = [...personnages];
            } else {
                // Sinon, filtrer les personnages par rôle
                filteredPersonnages = personnages.filter(p => p.role === role);
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
    }).catch(error => {
        console.error('Erreur lors du chargement des personnages :', error);
        content.innerHTML = `<p>Une erreur est survenue lors du chargement des personnages.</p>`;
    });
}