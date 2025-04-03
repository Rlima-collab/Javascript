import { Personnage } from '../provider.js';
import { ENDPOINT } from '../config.js';

export function renderCombat(content) {
  // Récupération de tous les personnages depuis l'API
  Personnage.fetchAll().then(personnages => {
    let selectedCharacters = []; // Tableau pour stocker les personnages sélectionnés

    // Fonction pour afficher la grille des personnages disponibles pour le combat
    function renderCombatGrid() {
      document.getElementById('combat-grid').innerHTML = personnages.map(p => `
        <div class="hero-card ${selectedCharacters.includes(p.id) ? 'selected' : ''}" data-id="${p.id}">
          <a href="#detail/${p.id}">
            <img class="hero-image" loading="lazy" src="${p.image}" alt="${p.nom}">
            <p class="hero-name">${p.nom}</p>
          </a>
          <button class="select-character btn">
            ${selectedCharacters.includes(p.id) ? 'Désélectionner' : 'Sélectionner'}
          </button>
        </div>
      `).join('');
    }

    // Fonction pour mettre à jour l'interface après sélection des personnages
    function updateCombatUI() {
      const startCombatButton = document.getElementById('startCombat');
      startCombatButton.disabled = selectedCharacters.length !== 2; // Activer le bouton uniquement si 2 personnages sont sélectionnés
      renderCombatGrid();
    }

    content.innerHTML = `
      <section class="hero-selection">
        <h2 class="section-title">Combat</h2>
        <p class="section-description">Sélectionnez deux personnages pour commencer le combat.</p>
        <div class="hero-grid" id="combat-grid"></div>
        <button id="startCombat" class="btn btn-primary" disabled>Commencer le combat</button>
        <div id="combatLog" class="combat-log"></div>
      </section>
    `;

    renderCombatGrid();

    // Gestion des clics sur les cartes des personnages
    document.getElementById('combat-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.hero-card');
      if (!card) return;

      const characterId = parseInt(card.dataset.id, 10);
      if (selectedCharacters.includes(characterId)) {
        // Désélectionner un personnage
        selectedCharacters = selectedCharacters.filter(id => id !== characterId);
      } else if (selectedCharacters.length < 2) {
        // Ajouter un personnage à la sélection
        selectedCharacters.push(characterId);
      }
      updateCombatUI();
    });

    // Gestion du clic sur le bouton "Commencer le combat"
    document.getElementById('startCombat').addEventListener('click', () => {
      if (selectedCharacters.length === 2) {
        startCombat(selectedCharacters[0], selectedCharacters[1]);
      } else {
        console.error('Deux personnages doivent être sélectionnés pour commencer le combat.');
      }
    });

    // Fonction pour démarrer un combat entre deux personnages
    function startCombat(id1, id2) {
      const char1 = personnages.find(p => p.id === id1);
      const char2 = personnages.find(p => p.id === id2);

      if (!char1 || !char2) {
        console.error('Impossible de trouver les personnages sélectionnés.');
        return;
      }

      let combatLog = document.getElementById('combatLog');
      combatLog.innerHTML = `<p>${char1.nom} et ${char2.nom} entrent en combat !</p>`;

      // Choix aléatoires pour le jeu "Pierre, Feuille, Ciseaux"
      const options = ["Pierre", "Feuille", "Ciseaux"];
      const choice1 = options[Math.floor(Math.random() * options.length)];
      const choice2 = options[Math.floor(Math.random() * options.length)];

      combatLog.innerHTML += `<p>${char1.nom} choisit ${choice1}.</p>`;
      combatLog.innerHTML += `<p>${char2.nom} choisit ${choice2}.</p>`;

      determineWinner(char1, char2, choice1, choice2); // Déterminer le gagnant
    }

    // Fonction pour déterminer le gagnant du combat
    function determineWinner(char1, char2, choice1, choice2) {
      let combatLog = document.getElementById('combatLog');

      if (choice1 === choice2) {
        // Cas d'égalité
        combatLog.innerHTML += `<p>Égalité ! Les deux personnages ont choisi ${choice1}.</p>`;
        updateEquipments(char1, char2, true); // Mise à jour des points en cas d'égalité
        return;
      }

      // Règles du jeu "Pierre, Feuille, Ciseaux"
      const rules = {
        Pierre: 'Ciseaux',
        Ciseaux: 'Feuille',
        Feuille: 'Pierre'
      };

      let winner, loser;
      if (rules[choice1] === choice2) {
        winner = char1;
        loser = char2;
      } else {
        winner = char2;
        loser = char1;
      }

      combatLog.innerHTML += `<p>${winner.nom} gagne avec ${choice1} contre ${choice2} !</p>`;
      updateEquipments(winner, loser);
    }

    // Fonction pour mettre à jour les points et équipements des personnages
    function updateEquipments(winner, loser, isDraw = false) {
      if (isDraw) {
        // En cas d'égalité, chaque personnage gagne 1 point
        winner.points = (winner.points || 0) + 1;
        loser.points = (loser.points || 0) + 1;
      } else {
        // Le gagnant gagne 3 points, le perdant ne gagne rien
        winner.points = (winner.points || 0) + 3;
        loser.points = (loser.points || 0);
      }

      // Mise à jour du nombre de combats pour les deux personnages
      winner.combats = (winner.combats || 0) + 1;
      loser.combats = (loser.combats || 0) + 1;

      // Transfert d'un équipement du perdant au gagnant (si disponible)
      if (!isDraw && loser.equipements.length > 0) {
        const equipementTransfere = loser.equipements.pop();
        winner.equipements.push(equipementTransfere);
        document.getElementById('combatLog').innerHTML += `<p>${winner.nom} récupère l'équipement "${equipementTransfere}" de ${loser.nom}.</p>`;
      }

      // Mise à jour des données des personnages via l'API
      updateCharacter(winner);
      updateCharacter(loser);
    }

    // Fonction pour mettre à jour un personnage dans l'API
    function updateCharacter(character) {
      fetch(`${ENDPOINT}/personnages/${character.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      }).then(() => {
        console.log(`Les données de ${character.nom} ont été mises à jour.`);
      }).catch(error => {
        console.error(`Erreur lors de la mise à jour de ${character.nom} :`, error);
      });
    }
  });
}