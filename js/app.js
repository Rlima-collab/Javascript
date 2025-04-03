import { renderListe } from './views/liste.js';
import { renderDetail } from './views/detail.js';
import { renderFavoris } from './views/favoris.js';
import { renderCombat } from './views/combat.js';
import { renderClassement } from './views/classement.js';

// Sélection de l'élément HTML où le contenu sera affiché
const content = document.getElementById('content');

function renderHome() {
    content.innerHTML = `
        <section id="home" class="home-page">
            <div class="video-and-description">
                <div id="video-container">
                    <div id="youtube-player"></div> <!-- Conteneur pour le lecteur YouTube -->
                </div>
                <div class="game-description">
                    <h2>Bienvenue dans Marvel Rivals</h2>
                    <p>Marvel Rivals est un jeu de combat en équipe où vous incarnez vos héros et vilains préférés de l'univers Marvel. Formez votre équipe, affrontez vos adversaires et dominez le champ de bataille avec des capacités uniques et des stratégies épiques.</p>
                </div>
            </div>
            <div class="buy-section">
                <div class="buy-text">
                    <h3>Où acheter Marvel Rivals ?</h3>
                    <p>Marvel Rivals est disponible sur les plateformes suivantes :</p>
                    <ul>
                        <li><a href="https://store.playstation.com/fr-fr/concept/10010451" target="_blank">PlayStation Store</a></li>
                        <li><a href="https://www.xbox.com/fr-fr/games/store/marvel-rivals/9n8pmw7qmd3d" target="_blank">Microsoft Store</a></li>
                        <li><a href="https://store.steampowered.com/app/2767030/Marvel_Rivals/" target="_blank">Steam</a></li>
                    </ul>
                </div>
                <div class="buy-image">
                    <img src="https://i0.wp.com/www.larevuedgeek.fr/wp-content/uploads/2024/12/marvel-rivals-1ywtf-1.png" alt="Marvel Rivals">
                </div>
            </div>
        </section>
    `;

    loadYouTubePlayer();
}

// Fonction pour gérer le routage en fonction du hash dans l'URL
function router() {
    const hash = window.location.hash || '#home'; // Récupérer le hash ou utiliser '#home' par défaut
    if (hash === '#home') {
        renderHome(); // Afficher la page d'accueil
    } else if (hash === '#liste') {
        renderListe(content); // Afficher la liste des personnages
    } else if (hash.startsWith('#detail/')) {
        const id = hash.split('/')[1]; // Extraire l'ID du personnage depuis le hash
        renderDetail(content, id); // Afficher les détails du personnage
    } else if (hash === '#favoris') {
        renderFavoris(content); // Afficher les favoris
    } else if (hash === '#combat') {
        renderCombat(content); // Afficher la page de combat
    } else if (hash === '#classement') {
        renderClassement(content); // Afficher le classement
    }
}

// Fonction pour charger l'API YouTube et créer le lecteur
function loadYouTubePlayer() {
    if (!window.YT || !window.YT.Player) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Fonction appelée lorsque l'API YouTube est prête
    window.onYouTubeIframeAPIReady = function () {
        createYouTubePlayer(); // Créer le lecteur YouTube
    };

    // Si l'API YouTube est déjà chargée, créer directement le lecteur
    if (window.YT && window.YT.Player) {
        createYouTubePlayer();
    }
}

// Fonction pour créer le lecteur YouTube
function createYouTubePlayer() {
    const existingPlayer = document.getElementById('youtube-player');
    if (existingPlayer) {
        existingPlayer.innerHTML = ''; // Réinitialiser le conteneur du lecteur
    }

    // Créer un nouveau lecteur YouTube
    new YT.Player('youtube-player', {
        videoId: 'DA4iVv4MARE', // ID de la vidéo YouTube
        playerVars: {
            autoplay: 1, // Lecture automatique
            controls: 0, // Masquer les contrôles
            showinfo: 0, // Masquer les informations
            modestbranding: 1, // Branding minimal
            loop: 1, // Lecture en boucle
            fs: 0, // Désactiver le mode plein écran
            rel: 0, // Ne pas afficher les vidéos associées
            start: 0, // Début de la vidéo
            end: 22, // Fin de la vidéo
            mute: 1, // Lecture en mode muet
            playlist: 'DA4iVv4MARE' // Playlist pour la boucle
        },
        events: {
            onReady: (event) => {
                event.target.mute(); // Mettre la vidéo en mode muet
            }
        }
    });
}

window.addEventListener('hashchange', router);

router();