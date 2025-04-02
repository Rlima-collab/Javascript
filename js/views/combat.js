import { Personnage } from '../provider.js';

export function renderCombat(content) {
  Personnage.fetchAll().then(personnages => {
    let selectedCharacters = [];

    function renderSelectedCharacters() {
      const selectedContainer = document.getElementById('selectedCharacters');
      selectedContainer.innerHTML = selectedCharacters.map(id => {
        const character = personnages.find(p => p.id.toString() === id);
        return `
          <div class="hero-card selected">
            <img loading="lazy" src="${character.image}" alt="${character.nom}">
            <p class="hero-name">${character.nom}</p>
          </div>
        `;
      }).join('');
    }

    function renderCharacterGrid() {
      document.getElementById('characterGrid').innerHTML = personnages.map(p => `
        <div class="hero-card ${selectedCharacters.includes(p.id.toString()) ? 'selected' : ''}" data-id="${p.id}">
          <img loading="lazy" src="${p.image}" alt="${p.nom}">
          <p class="hero-name">${p.nom}</p>
          <button class="select-character">${selectedCharacters.includes(p.id.toString()) ? 'Désélectionner' : 'Sélectionner'}</button>
        </div>
      `).join('');

      document.querySelectorAll('.select-character').forEach(button => {
        button.addEventListener('click', (e) => {
          const characterId = e.target.closest('.hero-card').dataset.id;
          if (selectedCharacters.includes(characterId)) {
            selectedCharacters = selectedCharacters.filter(id => id !== characterId);
          } else if (selectedCharacters.length < 2) {
            selectedCharacters.push(characterId);
          }
          renderCharacterGrid();
          renderSelectedCharacters();
          updateCombatButton();
        });
      });
    }

    function updateCombatButton() {
      const startCombatButton = document.getElementById('startCombat');
      startCombatButton.disabled = selectedCharacters.length !== 2;
    }

    content.innerHTML = `
      <section class="combat-section">
        <h2>Combat</h2>
        <p>Sélectionnez deux personnages pour commencer le combat.</p>
        <div id="selectedCharacters" class="hero-grid selected-grid"></div>
        <div class="hero-grid" id="characterGrid"></div>
        <button id="startCombat" disabled>Faire combattre</button>
        <div id="combatLog"></div>
      </section>
    `;

    renderCharacterGrid();
    renderSelectedCharacters();

    document.getElementById('startCombat').addEventListener('click', () => {
      if (selectedCharacters.length === 2) {
        const [id1, id2] = selectedCharacters;
        startCombat(id1, id2);
      }
    });

    function startCombat(id1, id2) {
      const char1 = personnages.find(p => p.id.toString() === id1);
      const char2 = personnages.find(p => p.id.toString() === id2);

      if (!char1 || !char2) {
        console.error('Impossible de trouver les personnages sélectionnés.');
        return;
      }

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
      winner.combats = (winner.combats || 0) + 1;
      loser.combats = (loser.combats || 0) + 1;
    
      if (isDraw) {
        winner.points = (winner.points || 0) + 1;
        loser.points = (loser.points || 0) + 1;
      } else {
        winner.points = (winner.points || 0) + 3;
        loser.points = (loser.points || 0);
    
        if (loser.equipements.length > 0) {
          const equipementTransfere = loser.equipements.pop();
          winner.equipements.push(equipementTransfere);
        }
      }
    
      fetch(`${ENDPOINT}/personnages/${winner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(winner)
      }).then(response => {
        if (!response.ok) {
          console.error(`Erreur lors de la mise à jour du gagnant (ID: ${winner.id})`);
        } else {
          console.log(`Données du gagnant (ID: ${winner.id}) mises à jour avec succès.`);
        }
      });
    
      fetch(`${ENDPOINT}/personnages/${loser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loser)
      }).then(response => {
        if (!response.ok) {
          console.error(`Erreur lors de la mise à jour du perdant (ID: ${loser.id})`);
        } else {
          console.log(`Données du perdant (ID: ${loser.id}) mises à jour avec succès.`);
        }
      });
    }
  });
}