document.addEventListener('DOMContentLoaded', () => {
    // 1. Prevent Browser Scroll Glitch
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // 2. Initial Load Logic
    const hash = window.location.hash.slice(1);
    
    // Define valid routes to detect 404s
    const validRoutes = ['home', 'apps', 'work', 'wallpapers', 'playlist', 'contact'];
    
    if (hash && validRoutes.includes(hash)) {
        switchTab(hash);
    } else if (hash && !validRoutes.includes(hash)) {
        render404(); // URL is weird, show 404
    } else {
        switchTab('home'); // Default
    }

    renderFooter();
});

function switchTab(tabName) {
    // 3. Update URL (Hash)
    window.location.hash = tabName;
    
    const navItems = document.querySelectorAll('.nav-item');
    let activeItem = null;

    // 4. Update Active Classes
    navItems.forEach(item => {
        item.classList.remove('active');
        if(item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${tabName}'`)) {
            item.classList.add('active');
            activeItem = item;
        }
    });

    // 5. SLIDING PILL LOGIC (Position & Size)
    const backdrop = document.querySelector('.nav-backdrop');
    if (activeItem && backdrop) {
        backdrop.style.opacity = '1';
        backdrop.style.width = `${activeItem.offsetWidth}px`;
        backdrop.style.transform = `translateX(${activeItem.offsetLeft}px)`;
    }

    // 6. Close Mobile Menu
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        icon.name = "menu-outline";
    }

    // 7. Page Animation Logic
    const app = document.getElementById('app');
    const footer = document.querySelector('footer');

    // Reset view
    window.scrollTo(0, 0); 
    app.classList.remove('show');
    if(footer) footer.classList.remove('visible');

    // Render & Fade In
    setTimeout(() => {
        app.innerHTML = ''; 
        
        if (tabName === 'home') renderHome(app);
        else if (tabName === 'apps') renderApps(app);
        else if (tabName === 'work') renderWork(app);
        else if (tabName === 'wallpapers') renderWallpapers(app);
        else if (tabName === 'playlist') renderPlaylist(app);
        else if (tabName === 'contact') renderContact(app);
        
        // Trigger Animation
        requestAnimationFrame(() => {
            app.classList.add('show');
            if(footer) setTimeout(() => footer.classList.add('visible'), 600);
        });
    }, 50);
}

// --- 404 PAGE ---
function render404() {
    const app = document.getElementById('app');
    const footer = document.querySelector('footer');
    if(footer) footer.classList.remove('visible');

    app.innerHTML = `
        <div class="container" style="text-align:center; padding-top:150px; min-height:80vh;">
            <h1 style="font-size: 6rem; color: #333; margin-bottom:0;">404</h1>
            <h2 style="font-size: 2rem; margin-bottom: 20px;">Page Not Found</h2>
            <p style="color: #999;">Redirecting home in <span id="countdown">3</span>s...</p>
        </div>
    `;
    
    app.classList.add('show');

    // Auto Redirect
    let seconds = 3;
    const interval = setInterval(() => {
        seconds--;
        const el = document.getElementById('countdown');
        if(el) el.innerText = seconds;
        
        if (seconds <= 0) {
            clearInterval(interval);
            switchTab('home');
        }
    }, 1000);
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        icon.name = "menu-outline";
    } else {
        menu.classList.add('open');
        icon.name = "close-outline";
    }
}

function createCard(item) {
    return `
        <a href="${item.link}" target="_blank" class="card">
            <img src="${item.img}" class="card-img" alt="${item.title}" loading="lazy" onerror="this.style.opacity='0.3'">
            <div class="card-body">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        </a>
    `;
}

// --- RENDERERS (Same as before) ---
function renderHome(container) {
    const sortedTimeline = [...data.timeline].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    container.innerHTML = `
        <div class="container hero">
            <img src="${data.profile.image}" class="profile-img" alt="Sujoy" onerror="this.src='https://via.placeholder.com/150/1a1a1a/555'">
            <h1>${data.profile.name}</h1>
            <p class="role">${data.profile.role}</p>
            <p class="bio">${data.profile.bio}</p>
            <div class="skills">${data.profile.skills.map(s => `<span>${s}</span>`).join('')}</div>
        </div>
        <div class="spacer"></div>
        <div class="container section-padding">
            <div class="section-header">
                <h2 class="section-title">Selected Apps</h2>
                <p class="section-subtitle">Top mobile applications developed by me.</p>
            </div>
            <div class="grid-3">
                ${data.apps.slice(0, 3).map(app => createCard(app)).join('')}
            </div>
            <div class="spacer"></div>
            <div class="section-header">
                <h2 class="section-title">Selected Projects</h2>
                <p class="section-subtitle">Web & Hardware experiments.</p>
            </div>
            <div class="grid-3">
                ${data.projects.slice(0, 3).map(p => createCard(p)).join('')}
            </div>
            <div class="spacer"></div>
            <div class="section-header">
                <h2 class="section-title">My Journey</h2>
                <p class="section-subtitle">Milestones and Learning Path.</p>
            </div>
            <div class="timeline">
                ${sortedTimeline.map(t => `
                    <div class="timeline-item">
                        <span class="t-year">${t.year}</span>
                        <h3>${t.title}</h3>
                        <p style="color:#999; font-size:0.95rem;">${t.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderApps(container) {
    container.innerHTML = `
        <div class="container section-padding">
            <div class="section-header">
                <h2 class="section-title">Applications</h2>
                <p class="section-subtitle">Designed and Created by Me.</p>
            </div>
            <div class="grid-2">
                ${data.apps.map(app => createCard(app)).join('')}
            </div>
        </div>
    `;
}

function renderWork(container) {
    container.innerHTML = `
        <div class="container section-padding">
            <div class="section-header">
                <h2 class="section-title">Selected Projects</h2>
                <p class="section-subtitle">A mix of code, design, and hardware experiments.</p>
            </div>
            <div class="grid-2">
                ${data.projects.map(p => createCard(p)).join('')}
            </div>
        </div>
    `;
}

function renderContact(container) {
    container.innerHTML = `
        <div class="container section-padding">
            <div class="section-header">
                <h2 class="section-title">Get In Touch</h2>
                <p class="section-subtitle">Connect with me across the web.</p>
            </div>
            <div class="contact-grid">
                <a href="${data.socials[0].link}" class="contact-card"><ion-icon name="mail"></ion-icon><span>Email</span></a>
                <a href="${data.socials[1].link}" target="_blank" class="contact-card"><ion-icon name="logo-instagram"></ion-icon><span>Instagram</span></a>
                <a href="${data.socials[2].link}" target="_blank" class="contact-card"><ion-icon name="logo-twitter"></ion-icon><span>Twitter/X</span></a>
                <a href="${data.socials[3].link}" target="_blank" class="contact-card"><ion-icon name="logo-github"></ion-icon><span>GitHub</span></a>
                <a href="${data.socials[4].link}" target="_blank" class="contact-card"><ion-icon name="logo-youtube"></ion-icon><span>YouTube</span></a>
                <a href="${data.socials[4].link}" target="_blank" class="contact-card"><ion-icon name="logo-linkedin"></ion-icon><span>Linkedin</span></a>
            </div>
        </div>
    `;
}

function renderWallpapers(container) {
    container.innerHTML = `
        <div class="container section-padding">
            <div class="flex-between">
                <div class="section-header" style="margin-bottom:0;">
                    <h2 class="section-title">Wallpaper Collection</h2>
                    <p class="section-subtitle">All Wallpapers are available for Mobile, PC & Mac.</p>
                    <p class="section-subtitle">Click on the image for download link or Use Pixels, Pixaby & Flickr</p>
                </div>
                <div class="ext-links">
                    <a href="https://pexels.com" target="_blank"><ion-icon name="camera"></ion-icon> Pexels</a>
                    <a href="https://pixabay.com" target="_blank"><ion-icon name="image"></ion-icon> Pixabay</a>
                    <a href="https://flickr.com" target="_blank"><ion-icon name="aperture"></ion-icon> Flickr</a>
                </div>
            </div>
            <div class="spacer" style="height:30px;"></div>
            <div class="wall-grid">
                ${data.wallpapers.map(w => `
                    <a href="${w.link}" target="_blank" class="wall-item">
                        <img src="${w.src}" alt="Wallpaper" loading="lazy" onerror="this.style.opacity='0.3'">
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function renderPlaylist(container) {
    container.innerHTML = `
        <div class="container section-padding">
            <div class="section-header">
                <h2 class="section-title">My Playlist</h2>
                <p class="section-subtitle">Music that keeps me going.</p>
            </div>
            <div class="pill-tabs">
                <button class="pill-btn active" onclick="loadSongs('devotional', this)">Devotional</button>
                <button class="pill-btn" onclick="loadSongs('hindi', this)">Hindi/Bengali</button>
                <button class="pill-btn" onclick="loadSongs('english', this)">English</button>
                <button class="pill-btn" onclick="loadSongs('movies', this)">Movies</button>
            </div>
            <div id="song-list"></div>
        </div>
    `;
    loadSongs('devotional', document.querySelector('.pill-btn'));
}

function loadSongs(type, btn) {
    document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    const items = data.playlists[type];
    document.getElementById('song-list').innerHTML = items.map(item => `
        <a href="${item.link}" target="_blank" class="song-row">
            <div>
                <strong style="display:block; font-size:1rem;">${item.title}</strong>
                <span style="color:#888; font-size:0.85rem;">${item.detail}</span>
            </div>
            ${type === 'movies' ? 
                `<span style="color:#FFD700; font-size:0.8rem;">IMDb</span>` : 
                `<ion-icon name="play-circle-outline" style="color:#FFD700; font-size:1.6rem;"></ion-icon>`
            }
        </a>
    `).join('');
}

function renderFooter() {
    const footerContainer = document.getElementById('footer-socials');
    if(footerContainer) {
        footerContainer.innerHTML = data.socials.map(s => `
            <a href="${s.link}" target="_blank" aria-label="${s.name}">
                <ion-icon name="${s.icon}"></ion-icon>
            </a>
        `).join('');
    }
}