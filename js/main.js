// main.js - Global Scripts for Diggi Palace Heritage Site

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
}

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
                        <a class="menu-row group flex items-baseline gap-6 py-3 border-b border-[#e4ddcd]" href="contact.html">
                            <span class="font-label-caps text-[10px] tracking-[0.16em] text-[#b3a486] group-hover:text-[#705b3c] transition-colors w-6">10</span>
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

