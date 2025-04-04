# Marvel Rivals - Documentation du Projet

Ce projet est une application web permettant de gérer et d'interagir avec des personnages de l'univers Marvel. L'application propose plusieurs fonctionnalités, telles que la liste des personnages, les détails des personnages, un classement, des favoris, et un mode combat.

## Structure du Projet

### **Dossiers et Fichiers**

#### **1. `css/`**
- **`styles.css`** : Contient les styles CSS pour l'ensemble de l'application. Il définit l'apparence des pages, des cartes de personnages, des boutons, des grilles, et des autres éléments visuels.

#### **2. `data/`**
- **`personnages.json`** : Contient les données actuelles des personnages, y compris leurs rôles, équipements, points, combats, etc. Ce fichier est utilisé pour afficher et manipuler les données des personnages dans l'application.

#### **3. `js/`**
Ce dossier contient le code JavaScript de l'application, organisé en plusieurs fichiers pour une meilleure modularité.

##### **3.1. `app.js`**
- Point d'entrée principal de l'application.
- Gère le routage entre les différentes pages (accueil, liste des personnages, détails, favoris, classement, combat).
- Charge dynamiquement le contenu des pages en fonction du hash dans l'URL.

##### **3.2. `config.js`**
- Contient la configuration de l'application, notamment l'URL de l'API (`ENDPOINT`).

##### **3.3. `provider.js`**
- Définit la classe `Personnage` qui représente un personnage Marvel.
- Contient des méthodes statiques pour interagir avec l'API, telles que :
  - `fetchAll()` : Récupère tous les personnages.
  - `fetchById(id)` : Récupère un personnage spécifique par son ID.
  - `updateNote()` : Met à jour la note d'un personnage.

##### **3.4. `views/`**
Ce sous-dossier contient les fichiers responsables du rendu des différentes pages de l'application.

- **`liste.js`** : 
  - Affiche la liste des personnages.
  - Permet de rechercher, filtrer par rôle, et trier les personnages par ordre alphabétique.
  
- **`detail.js`** : 
  - Affiche les détails d'un personnage spécifique, y compris ses équipements, points, combats, et note.
  - Permet de noter un personnage et de l'ajouter ou le retirer des favoris.

- **`favoris.js`** : 
  - Affiche la liste des personnages ajoutés aux favoris.
  - Permet de rechercher, filtrer, et trier les favoris.

- **`classement.js`** : 
  - Affiche un classement des personnages basé sur leurs points.
  - Trie les personnages par ordre décroissant de points.

- **`combat.js`** : 
  - Permet de sélectionner deux personnages pour un combat.
  - Simule un combat basé sur un jeu de "Pierre, Feuille, Ciseaux".
  - Met à jour les points, combats, et équipements des personnages après le combat.

#### **4. `index.html`**
- Fichier HTML principal de l'application.
- Contient la structure de base de la page, y compris le menu de navigation, le conteneur principal pour le contenu dynamique, et les liens vers les fichiers CSS et JavaScript.

---

## Fonctionnalités Principales

1. **Liste des Personnages** :
   - Affiche tous les personnages disponibles.
   - Recherche par nom, filtre par rôle, et tri alphabétique.

2. **Détails des Personnages** :
   - Affiche les informations détaillées d'un personnage.
   - Permet de noter un personnage et de l'ajouter aux favoris.

3. **Favoris** :
   - Affiche les personnages ajoutés aux favoris.
   - Recherche, filtre, et tri des favoris.

4. **Classement** :
   - Affiche un classement des personnages basé sur leurs points.

5. **Combat** :
   - Permet de simuler un combat entre deux personnages.
   - Met à jour les points, combats, et équipements des personnages.