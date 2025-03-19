import { renderListe } from './views/liste.js';
import { renderDetail } from './views/detail.js';
import { renderFavoris } from './views/favoris.js';

const content = document.getElementById('content');

function renderHome() {
    content.innerHTML = `
        <section id="home" class="home-page">
            <header>
                <h1>Marvel Rivals - The Super Hero Team-based PVP Shooter</h1>
            </header>
            <section id="seasons">
                <h2>Saisons Actuelles</h2>
                <p>Current Season: Season 0: DOOM'S RISE</p>
                <p>Next Season: Season 1: Eternal Night Falls</p>
            </section>
            <section id="features">
                <h2>Fonctionnalités Clés</h2>
                <ul>
                    <li>Combats en tant que Super Héros et Vilains dans des mondes du Multivers Marvel</li>
                    <li>Nouvelles capacités d’équipe emblématiques</li>
                    <li>Destruction environnementale dynamique des lieux Marvel célèbres</li>
                    <li>Combats rapides 6v6</li>
                </ul>
            </section>
            <section id="maps">
                <h2>Cartes/Emplacements</h2>
                <ul>
                    <li>Empire of Eternal Night: Midtown, Sanctum Sanctorum</li>
                    <li>Klyntar: Symbiotic Surface</li>
                    <li>Hydra Charteris Base: Hell's Heaven</li>
                    <li>Intergalactic Empire of Wakanda: Birnin T'Challa</li>
                    <li>Tokyo 2099: Spider-Islands, Shin-Shibuya</li>
                    <li>Yggsgard: Yggdrasill Path and Royal Palace</li>
                </ul>
            </section>
            <section id="platforms">
                <h2>Disponible sur</h2>
                <a href="https://store.epicgames.com/p/marvel-rivals-182004" target="_blank">Windows (Epic Games)</a>
                <a href="https://www.microsoft.com/store/productid/9n8pmw7qmd3d" target="_blank">Windows (Microsoft Store)</a>
                <a href="https://store.playstation.com/en-us/concept/10010451/" target="_blank">PlayStation 5</a>
            </section>
            <section id="social">
                <h2>Suivez-nous</h2>
                <a href="https://twitter.com/MarvelRivals" target="_blank">X</a>
                <a href="https://www.youtube.com/@MarvelRivals" target="_blank">YouTube</a>
                <a href="https://discord.gg/marvelrivals" target="_blank">Discord</a>
                <a href="https://www.instagram.com/marvelrivals/" target="_blank">Instagram</a>
                <a href="https://www.tiktok.com/@marvelrivals" target="_blank">TikTok</a>
                <a href="https://www.facebook.com/marvelrivals" target="_blank">Facebook</a>
                <a href="https://www.twitch.tv/marvelrivals" target="_blank">Twitch</a>
            </section>
        </section>
    `;
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

window.addEventListener('hashchange', router);
router();