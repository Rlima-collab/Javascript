import { renderListe } from './views/liste.js';
import { renderDetail } from './views/detail.js';
import { renderFavoris } from './views/favoris.js';

const content = document.getElementById('content');

function renderHome() {
    content.innerHTML = `
        <section id="home" class="home-page">
            <div class="video-and-description">
                <div id="video-container">
                    <div id="youtube-player"></div>
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
                        <li><a href="https://store.playstation.com" target="_blank">PlayStation Store</a></li>
                        <li><a href="https://www.microsoft.com/store" target="_blank">Microsoft Store</a></li>
                        <li><a href="https://store.steampowered.com" target="_blank">Steam</a></li>
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

function router() {
    const hash = window.location.hash || '#home';
    if (hash === '#home') {
        renderHome();
    } else if (hash === '#liste') {
        renderListe(content);
    } else if (hash.startsWith('#detail/')) {
        const id = hash.split('/')[1];
        renderDetail(content, id);
    } else if (hash === '#favoris') {
        renderFavoris(content);
    }
}

function loadYouTubePlayer() {
    if (!window.YT || !window.YT.Player) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = function () {
        createYouTubePlayer();
    };

    if (window.YT && window.YT.Player) {
        createYouTubePlayer();
    }
}

function createYouTubePlayer() {
    const existingPlayer = document.getElementById('youtube-player');
    if (existingPlayer) {
        existingPlayer.innerHTML = '';
    }

    new YT.Player('youtube-player', {
        videoId: 'DA4iVv4MARE',
        playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
            fs: 0,
            rel: 0,
            start: 0,
            end: 22,
            mute: 1,
            playlist: 'DA4iVv4MARE'
        },
        events: {
            onReady: (event) => {
                event.target.mute();
            }
        }
    });
}

window.addEventListener('hashchange', router);
router();