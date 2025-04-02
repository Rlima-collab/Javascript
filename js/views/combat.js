import { Personnage } from '../provider.js';
import { ENDPOINT } from '../config.js';

export function renderCombat(content) {
  Personnage.fetchAll().then(personnages => {
    let selectedCharacters = [];

    function updateCombatUI() {
      const startCombatButton = document.getElementById('startCombat');
      startCombatButton.disabled = selectedCharacters.length !== 2;
    }

    content.innerHTML = `
      <section class="combat-section">
        <h2>Combat</h2>
        <p>Sélectionnez deux personnages pour commencer le combat.</p>
        <div class="combat-selection">
          ${personnages.map(p => `
            <div class="hero-card" data-id="${p.id}">
              <img loading="lazy" src="${p.image}" alt="${p.nom}">
              <p class="hero-name">${p.nom}</p>
              <button class="select-character">Sélectionner</button>
            </div>
          `).join('')}
        </div>
        <button id="startCombat" disabled>Commencer le combat</button>
        <div id="combatLog"></div>
      </section>
    `;

    document.querySelectorAll('.select-character').forEach(button => {
      button.addEventListener('click', (e) => {
        const characterId = parseInt(e.target.closest('.hero-card').dataset.id, 10);
        if (selectedCharacters.includes(characterId)) {
          selectedCharacters = selectedCharacters.filter(id => id !== characterId);
          e.target.textContent = 'Sélectionner';
        } else if (selectedCharacters.length < 2) {
          selectedCharacters.push(characterId);
          e.target.textContent = 'Désélectionner';
        }
        updateCombatUI();
      });
    });

    document.getElementById('startCombat').addEventListener('click', () => {
      if (selectedCharacters.length === 2) {
        startCombat(selectedCharacters[0], selectedCharacters[1]);
      }
    });

    function startCombat(id1, id2) {
      const char1 = personnages.find(p => p.id === id1);
      const char2 = personnages.find(p => p.id === id2);

      if (!char1 || !char2) return;

      let combatLog = document.getElementById('combatLog');
      combatLog.innerHTML = `<p>${char1.nom} et ${char2.nom} entrent en combat !</p>`;

      const options = ["Pierre", "Feuille", "Ciseaux"];
      const choice1 = options[Math.floor(Math.random() * options.length)];
      const choice2 = options[Math.floor(Math.random() * options.length)];

      combatLog.innerHTML += `<p>${char1.nom} choisit ${choice1}.</p>`;
      combatLog.innerHTML += `<p>${char2.nom} choisit ${choice2}.</p>`;

      determineWinner(char1, char2, choice1, choice2);
    }

    function determineWinner(char1, char2, choice1, choice2) {
      let combatLog = document.getElementById('combatLog');

      if (choice1 === choice2) {
        combatLog.innerHTML += `<p>Égalité ! Les deux personnages ont choisi ${choice1}.</p>`;
        updateEquipments(char1, char2, true);
        return;
      }

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

    function updateEquipments(winner, loser, isDraw = false) {
      // Mettre à jour les points et le nombre de combats
      winner.combats = (winner.combats || 0) + 1;
      loser.combats = (loser.combats || 0) + 1;
    
      if (isDraw) {
        winner.points = (winner.points || 0) + 1;
        loser.points = (loser.points || 0) + 1;
      } else {
        winner.points = (winner.points || 0) + 3;
        loser.points = (loser.points || 0);
    
        // Transférer un seul équipement du perdant au gagnant
        if (loser.equipements.length > 0) {
          const equipementTransfere = loser.equipements.pop(); // Retirer un équipement du perdant
          winner.equipements.push(equipementTransfere); // Ajouter cet équipement au gagnant
        }
      }
    
      // Mettre à jour les données sur le serveur
      fetch(`${ENDPOINT}/personnages/${winner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winner)
      });
    
      fetch(`${ENDPOINT}/personnages/${loser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loser)
      });
    }
  });
}