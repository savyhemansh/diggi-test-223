// main.js - Global Scripts for Diggi Palace Heritage Site

// ============================================================
// GOOGLE ANALYTICS 4 (consent-gated)
// Loads gtag.js only after the visitor has accepted cookies via the
// consent banner below. Self-contained here so every page that includes
// main.js gets it automatically — no per-page <script> tags needed.
// ============================================================
const GA_MEASUREMENT_ID = 'G-57THQ3DCNE';
let gaLoaded = false;

function loadGoogleAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

function initAnalyticsConsentGate() {
    if (window.cookieConsent.categories().statistics) loadGoogleAnalytics();
}

// Scroll reveal initial states
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

function initAll() {
    // 1. Initialise Scroll Reveal Observer
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
    // 2. Initialise Button Click Scale Micro-interactions
    // Skip elements inside #runway-carousel — carousel cards manage their own transforms
    document.querySelectorAll('button, .nav-btn').forEach(button => {
        if (button.closest('#runway-carousel') || button.closest('#carousel-track')) return;
        // Skip controls whose position relies on a CSS transform (arrows, centered
        // overlays) — the inline scale() would clobber their translate and make them jump.
        if (button.classList.contains('no-press') || /\b(absolute|fixed|-?translate-)/.test(button.className)) return;
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98)';
        });
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // 3. Initialise Menu Overlay Injector & Click Handlers
    initMenuOverlay();

    // 4. Initialise Pinned Gallery Scroll-Driven Experience
    initPinnedGallery();

    // 5. Initialise Cookie Consent Banner
    initCookieConsent();

    // 6. Load Google Analytics if consent was already given on a previous visit
    initAnalyticsConsentGate();
}

// ============================================================
// COOKIE CONSENT
// Discreet bottom bar shown until the visitor makes a choice.
// Consent is stored per-category in localStorage so each toggle controls
// only its own scripts — e.g. turning Statistics off and clicking OK does
// NOT load Google Analytics. Any future script (Meta Pixel, a chat widget,
// etc.) should gate itself the same way GA does, via
// window.cookieConsent.categories().<key> or the onChange() hook below.
// ============================================================
const COOKIE_CONSENT_KEY = 'diggi_cookie_consent_categories';
const COOKIE_CONSENT_DECIDED_KEY = 'diggi_cookie_consent_decided';
const COOKIE_CATEGORY_DEFS = [
    { key: 'necessary',   label: 'Necessary',   locked: true  },
    { key: 'preferences', label: 'Preferences',  locked: false },
    { key: 'statistics',  label: 'Statistics',   locked: false },
    { key: 'marketing',   label: 'Marketing',    locked: false },
];
const consentListeners = [];

function readStoredCategories() {
    try {
        const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        // Private mode / storage blocked / corrupt JSON — fall through to defaults.
    }
    return null;
}

function writeStoredCategories(categories) {
    try {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(categories));
        localStorage.setItem(COOKIE_CONSENT_DECIDED_KEY, 'true');
    } catch (e) {
        // Storage blocked — choice only persists for this page view.
    }
    consentListeners.forEach(fn => fn(categories));
}

function initCookieConsent() {
    // Already chosen, or injected already — do nothing.
    if (document.getElementById('cookie-banner')) return;

    let decided = null;
    try {
        decided = localStorage.getItem(COOKIE_CONSENT_DECIDED_KEY);
    } catch (e) {
        // Treat as "not yet decided".
    }
    if (decided === 'true') return;

    const toggleRowHtml = COOKIE_CATEGORY_DEFS.map(cat => `
        <div class="cookie-toggle">
            <span class="cookie-toggle__label">${cat.label}</span>
            <button type="button"
                class="cookie-switch ${cat.locked ? 'is-locked is-on' : 'is-on'} no-press"
                data-category="${cat.key}"
                ${cat.locked ? 'disabled' : ''}
                role="switch"
                aria-checked="true"
                aria-label="${cat.label} cookies">
                <span class="cookie-switch__knob"></span>
            </button>
        </div>`).join('');

    const banner = document.createElement('aside');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
        <div class="cookie-banner__inner">
            <div class="cookie-banner__top">
                <div class="cookie-banner__copy">
                    <h2 class="cookie-banner__heading">This website uses cookies</h2>
                    <p class="cookie-banner__text">
                        We use cookies to personalise content, remember your preferences and
                        analyse our traffic, so we can continue offering you a refined and
                        seamless experience of Diggi Palace. Use the switches below to choose
                        which categories you allow.
                    </p>
                </div>
                <button type="button" class="cookie-btn cookie-btn--accept no-press" data-consent="confirm">OK</button>
            </div>
            <div class="cookie-banner__bottom">
                <div class="cookie-banner__toggles">${toggleRowHtml}</div>
                <button type="button" class="cookie-banner__details no-press" data-consent="declined">Decline All</button>
            </div>
        </div>`;

    document.body.appendChild(banner);

    // Animate in after the element is in the DOM.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => banner.classList.add('is-visible'));
    });

    function currentToggleStates() {
        const categories = {};
        COOKIE_CATEGORY_DEFS.forEach(cat => {
            const sw = banner.querySelector(`.cookie-switch[data-category="${cat.key}"]`);
            categories[cat.key] = cat.locked ? true : sw.classList.contains('is-on');
        });
        return categories;
    }

    function closeBanner() {
        banner.classList.remove('is-visible');
        banner.addEventListener('transitionend', () => banner.remove(), { once: true });
        // Fallback removal in case transitionend doesn't fire.
        setTimeout(() => banner.remove(), 700);
    }

    banner.querySelector('[data-consent="confirm"]').addEventListener('click', () => {
        writeStoredCategories(currentToggleStates());
        closeBanner();
    });

    banner.querySelector('[data-consent="declined"]').addEventListener('click', () => {
        const allOff = {};
        COOKIE_CATEGORY_DEFS.forEach(cat => { allOff[cat.key] = cat.locked; });
        writeStoredCategories(allOff);
        closeBanner();
    });

    banner.querySelectorAll('.cookie-switch:not(.is-locked)').forEach(sw => {
        sw.addEventListener('click', () => {
            const on = sw.classList.toggle('is-on');
            sw.setAttribute('aria-checked', String(on));
        });
    });
}

// Public hook so any script (current or future) can read/reset consent
// and react immediately when the visitor changes their choice.
window.cookieConsent = {
    categories() {
        const stored = readStoredCategories();
        const result = {};
        COOKIE_CATEGORY_DEFS.forEach(cat => {
            result[cat.key] = cat.locked ? true : !!(stored && stored[cat.key]);
        });
        return result;
    },
    status() {
        try {
            return localStorage.getItem(COOKIE_CONSENT_DECIDED_KEY) === 'true' ? 'decided' : null;
        } catch (e) {
            return null;
        }
    },
    onChange(fn) {
        if (typeof fn === 'function') consentListeners.push(fn);
    },
    reset() {
        try {
            localStorage.removeItem(COOKIE_CONSENT_KEY);
            localStorage.removeItem(COOKIE_CONSENT_DECIDED_KEY);
        } catch (e) {}
    }
};

// Re-evaluate consent-gated scripts the instant the visitor changes a toggle.
window.cookieConsent.onChange((categories) => {
    if (categories.statistics) loadGoogleAnalytics();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Scroll logic for navbar translucency & border details
window.addEventListener('scroll', function() {
    const header = document.getElementById('top-nav');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Dynamic Fullscreen Minimalist Menu Overlay Component Injection
function initMenuOverlay() {
    // Create the overlay container element
    const overlay = document.createElement('div');
    overlay.id = 'menu-overlay';
    overlay.className = 'fixed inset-0 z-[100] hidden flex flex-col md:flex-row bg-[#ffffff] opacity-0 transition-all duration-500 ease-in-out';
    overlay.innerHTML = `
        <!-- Left Section: Navigation & Content -->
        <div class="relative w-full md:w-[55%] flex flex-col px-10 md:px-16 py-10 h-full overflow-y-auto bg-white">
            <!-- Top Bar -->
            <header class="flex items-center mb-12 md:mb-16 bg-transparent border-none relative" style="border:none !important;">
                <button id="menu-close-btn" class="group flex items-center space-x-3 text-[#4d463c] hover:text-[#705b3c] transition-colors duration-300">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                    <span class="font-label-caps tracking-[0.2em] text-[10px] uppercase">Close</span>
                </button>
                <div class="ml-8 md:ml-16">
                    <a href="index.html"><h1 class="font-ornamental text-[#705b3c] text-[15px] md:text-[17px] tracking-[0.16em] uppercase">Diggi Palace</h1></a>
                </div>
            </header>
            <!-- Main Navigation: centered single column with index numerals + hairline rhythm -->
            <div class="flex-grow flex items-center">
                <nav class="w-full max-w-[440px]">
                    <p class="font-label-caps text-[10px] tracking-[0.24em] text-[#705b3c] uppercase mb-7">Explore</p>
                    <div class="border-t border-[#e4ddcd]">
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="index.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">01</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Homepage</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="stay.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">02</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Stay</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="culinary.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">03</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Culinary</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="celebrations.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">04</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Celebrations</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="events.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">05</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Events</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="experiences.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">06</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Curated Experiences</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="history.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">07</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">History</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="sustainability.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">08</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Sustainability</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="gallery/index.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">09</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Gallery</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="guest-love.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">10</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Guest Voices</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="blog.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">11</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Journal</span>
                        </a>
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="contact.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">12</span>
                            <span class="font-ornamental text-[17px] md:text-[19px] text-[#1a1c1a] group-hover:text-[#705b3c] transition-colors">Contact</span>
                        </a>
                    </div>
                </nav>
            </div>
            <!-- Footer Info -->
            <footer class="mt-auto pt-10 border-t border-[#d0c5b8]/30 flex flex-col md:flex-row justify-between gap-8 w-full pb-4">
                <div class="space-y-2">
                    <p class="font-label-caps text-[9px] text-[#7f766b] tracking-[0.2em] uppercase">Location</p>
                    <p class="font-body-md text-[#4d463c] leading-relaxed max-w-[260px] text-[13px]">
                        Diggi House, Sawai Ram Singh Road,<br>
                        Jaipur, Rajasthan 302004, India
                    </p>
                </div>
                <div class="space-y-2">
                    <p class="font-label-caps text-[9px] text-[#7f766b] tracking-[0.2em] uppercase">Inquiries</p>
                    <p class="font-body-md text-[#4d463c] text-[13px]">+91 141 2373091 • 2366120</p>
                    <p class="font-body-md text-[#4d463c] text-[13px]">reservations@diggipalace.com</p>
                </div>
            </footer>
        </div>
        <!-- Right Section: Cinematic Visual -->
        <div class="hidden md:block w-[45%] h-full relative overflow-hidden">
            <img alt="Diggi Palace" class="image-reveal absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[2000ms] ease-out" src="mock aman images /imageye___-_imgi_88_Amanbagh-Amansanti-Musician.jpg">
            <!-- Decorative Border Frame -->
            <div class="absolute inset-6 border border-white/20 z-20 pointer-events-none"></div>
            <!-- Contextual Overlay Tag -->
            <div class="absolute bottom-12 right-12 z-20 text-right">
                <p class="font-label-caps text-white tracking-[0.35em] text-[10px] opacity-80">SINCE 1860</p>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Setup triggers
    const menuBtn = document.getElementById('menu-trigger') || document.querySelector('header button.nav-link') || document.querySelector('header button');
    const closeBtn = document.getElementById('menu-close-btn');

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMenu(overlay);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMenu(overlay);
        });
    }

    // Parallax mousemove hover effect for the menu visual
    const menuImage = overlay.querySelector('.image-reveal');
    if (menuImage) {
        overlay.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            menuImage.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        });
    }
}

function openMenu(overlay) {
    overlay.classList.remove('hidden');
    // Force reflow
    overlay.offsetHeight;
    overlay.classList.add('opacity-100');
    overlay.classList.remove('opacity-0');
    document.body.classList.add('overflow-hidden');

    // Staggered menu items entrance
    const menuItems = overlay.querySelectorAll('nav a');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 + (index * 60));
    });
}

function closeMenu(overlay) {
    overlay.classList.add('opacity-0');
    overlay.classList.remove('opacity-100');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 500);
}

// Pinned Gallery — Suryagarh exact mechanic
// Left column is CSS sticky. Right images scroll naturally.
// JS only updates left text via IntersectionObserver.
function initPinnedGallery() {
    const section = document.getElementById('pinned-gallery');
    if (!section) return;

    const items = section.querySelectorAll('.gallery-item');
    const titleEl = document.getElementById('gallery-title');
    const badgeEl = document.getElementById('gallery-badge');

    if (!items.length || !titleEl) return;

    const data = [
        { title: 'Private High Tea on the Lawns',  badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Meditation Mornings',             badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Yoga Mornings',                   badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Traditional Music Sessions',      badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Royal Portrait Photo Shoots',     badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Jeep Safari Expeditions',         badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Trekking the Aravallis',          badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Secret Lakes & Hidden Waters',    badge: 'SIGNATURE ENCOUNTERS' },
        { title: 'Puppet Theatre',                  badge: 'LIFE AT DIGGI' },
        { title: 'Royal Thali',                     badge: 'LIFE AT DIGGI' },
        { title: 'Royal Chronicle',                 badge: 'LIFE AT DIGGI' },
    ];

    titleEl.style.transition = 'opacity 200ms ease';
    if (badgeEl) badgeEl.style.transition = 'opacity 200ms ease';

    let activeIndex = -1;

    function setActive(index) {
        if (index === activeIndex) return;
        activeIndex = index;
        const item = data[index];
        if (!item) return;

        titleEl.style.opacity = '0';
        if (badgeEl) badgeEl.style.opacity = '0';

        setTimeout(() => {
            titleEl.textContent = item.title;
            if (badgeEl) badgeEl.textContent = item.badge;
            titleEl.style.opacity = '1';
            if (badgeEl) badgeEl.style.opacity = '1';
        }, 200);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(parseInt(entry.target.dataset.index));
            }
        });
    }, { threshold: 0.5 });

    items.forEach(item => observer.observe(item));

    // Set first item immediately
    titleEl.textContent = data[0].title;
    if (badgeEl) badgeEl.textContent = data[0].badge;
    titleEl.style.opacity = '1';
    if (badgeEl) badgeEl.style.opacity = '1';
}

