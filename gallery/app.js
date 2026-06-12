/* ============================================================
   Diggi Palace — Gallery logic
   Filtering · search · masonry · lightbox
   ============================================================ */

// Category definitions — ordered. `all` is implicit/first.
const CATEGORIES = [
    { id: 'all',           label: 'All' },
    { id: 'heritage',      label: 'Heritage & Architecture' },
    { id: 'stay',          label: 'Rooms & Suites' },
    { id: 'celebrations',  label: 'Celebrations & Weddings' },
    { id: 'events',        label: 'Events & Banquets' },
    { id: 'culinary',      label: 'Dining & Bar' },
    { id: 'experiences',   label: 'Curated Experiences' },
    { id: 'gardens',       label: 'Gardens & Pool' },
    { id: 'wellness',      label: 'Spa & Wellness' },
];

// Image dataset. cats = array of category ids the image belongs to.
const IMAGES = [
    { src: 'imgi_79_exterior-amansanti.jpg',                                              title: 'The Palace Facade',         cat: 'Heritage', cats: ['heritage'] },
    { src: 'imgi_252_exterior-detail.jpg',                                                title: 'Carved Stonework',          cat: 'Heritage', cats: ['heritage'] },
    { src: 'hawa mahal.jpg',                                                              title: 'A City of Palaces',         cat: 'Heritage', cats: ['heritage'] },
    { src: 'history-hero.jpg',                                                            title: 'Since 1860',                cat: 'Heritage', cats: ['heritage'] },
    { src: 'imageye___-_imgi_89_Amanbagh-Entrance-Vehicle.jpg',                           title: 'The Royal Arrival',         cat: 'Heritage', cats: ['heritage'] },
    { src: 'imageye___-_imgi_100_Amanbagh-Walkway.jpg',                                   title: 'Colonnaded Walkway',        cat: 'Heritage', cats: ['heritage', 'gardens'] },
    { src: 'imageye___-_imgi_78_Amanbagh%2C India - Main Building%2C Pool View-2.jpg',    title: 'Courtyard Reflections',     cat: 'Heritage', cats: ['heritage', 'gardens'] },
    { src: 'thikana restoration.jpg',                                                     title: 'A Living Restoration',      cat: 'Heritage', cats: ['heritage'] },
    { src: 'section 2.jpg',                                                               title: 'Ancestral Corridors',       cat: 'Heritage', cats: ['heritage'] },
    { src: 'section 3.jpg',                                                               title: 'Quiet Courtyards',          cat: 'Heritage', cats: ['heritage'] },

    { src: 'Palace Suite.jpg',                                                            title: 'The Palace Suite',          cat: 'Rooms & Suites', cats: ['stay'] },
    { src: 'Courtyard Suite.jpg',                                                         title: 'The Courtyard Suite',       cat: 'Rooms & Suites', cats: ['stay'] },
    { src: 'Heritage Deluxe rooms.jpg',                                                   title: 'Heritage Deluxe',           cat: 'Rooms & Suites', cats: ['stay'] },
    { src: 'Heritage Standard room.jpg',                                                  title: 'Heritage Standard',         cat: 'Rooms & Suites', cats: ['stay'] },
    { src: 'imageye___-_imgi_87_Amanbagh%2C India - Terrace Haveli Suite..jpg',           title: 'Terrace Haveli Suite',      cat: 'Rooms & Suites', cats: ['stay'] },
    { src: 'imageye___-_imgi_97_Amanbagh%2C India - Accommodation%2C Terrace Haveli Suite Garden View (1).jpg', title: 'Garden View Suite', cat: 'Rooms & Suites', cats: ['stay', 'gardens'] },
    { src: 'terrace baithak.jpg',                                                         title: 'The Terrace Baithak',       cat: 'Rooms & Suites', cats: ['stay'] },

    { src: 'imageye___-_imgi_216_Amanbagh-Amansanti-Rangoli.jpg',                         title: 'Rangoli Welcome',           cat: 'Celebrations', cats: ['celebrations'] },
    { src: 'imageye___-_imgi_244_Amanbagh-Group-Portrait_0.jpg',                          title: 'Gathered in Joy',           cat: 'Celebrations', cats: ['celebrations', 'events'] },
    { src: 'imageye___-_imgi_88_Amanbagh-Amansanti-Musician.jpg',                         title: 'Court Musicians',           cat: 'Celebrations', cats: ['celebrations', 'experiences'] },
    { src: 'imageye___-_imgi_260_22-11-Amanbagh-Amansanti-Musician-0621.jpg',             title: 'An Evening of Raga',        cat: 'Celebrations', cats: ['celebrations', 'experiences'] },
    { src: 'imageye___-_imgi_361_Amanbagh-Experience-Chhatri-Dinner-2111.jpg',            title: 'The Chhatri Dinner',        cat: 'Celebrations', cats: ['celebrations', 'culinary', 'events'] },
    { src: 'imageye___-_imgi_212_Amanbagh-Amansanti-Jockey_0.jpg',                        title: 'The Baraat Procession',     cat: 'Celebrations', cats: ['celebrations'] },
    { src: 'imageye___-_imgi_288_Amanbagh-Amansanti-Jockey.jpg',                          title: 'Royal Festivities',         cat: 'Celebrations', cats: ['celebrations', 'events'] },

    { src: 'The Royal Chronicle.jpg',                                                     title: 'Banquet Halls',             cat: 'Events & Banquets', cats: ['events'] },
    { src: 'The Dawn Escape.jpg',                                                         title: 'Open-Air Gatherings',       cat: 'Events & Banquets', cats: ['events', 'gardens'] },
    { src: '1.jpg',                                                                       title: 'Conference & Conclave',     cat: 'Events & Banquets', cats: ['events'] },
    { src: '4.jpg',                                                                       title: 'Private Functions',         cat: 'Events & Banquets', cats: ['events'] },
    { src: '5.jpg',                                                                       title: 'Corporate Soirées',         cat: 'Events & Banquets', cats: ['events'] },

    { src: 'imgi_268_food-beverages.jpg',                                                 title: 'Rajasthani Thali',          cat: 'Dining & Bar', cats: ['culinary'] },
    { src: 'imageye___-_imgi_98_Amanbagh-Bar-Detail-1745.jpg',                            title: 'The Heritage Bar',          cat: 'Dining & Bar', cats: ['culinary'] },
    { src: '2.jpg',                                                                       title: 'Fine Dining',               cat: 'Dining & Bar', cats: ['culinary'] },
    { src: '3.jpg',                                                                       title: 'Courtyard Breakfast',       cat: 'Dining & Bar', cats: ['culinary', 'gardens'] },

    { src: 'imageye___-_imgi_168_Amanbagh-Experience-Bhangarh.jpg',                       title: 'Bhangarh at Dawn',          cat: 'Experiences', cats: ['experiences'] },
    { src: 'imageye___-_imgi_111_Aman-i-Khas%2C India - Experience%2C Safari (1)_0.jpg',  title: 'Into the Wild',             cat: 'Experiences', cats: ['experiences'] },
    { src: 'imageye___-_imgi_106_Amanbagh - Wildlife in India.jpg',                       title: 'Wildlife Encounters',       cat: 'Experiences', cats: ['experiences'] },
    { src: 'imageye___-_imgi_105_Amanbagh-Views_0.jpg',                                   title: 'Aravalli Vistas',           cat: 'Experiences', cats: ['experiences', 'gardens'] },
    { src: 'imageye___-_imgi_204_Amanbagh-Experience-Bhangarh-Yoga.jpg',                  title: 'Sunrise Yoga',              cat: 'Experiences', cats: ['experiences', 'wellness'] },
    { src: 'imageye___-_imgi_296_22-11-Amanbagh-Experience-Bhangarh-Yoga-1999.jpg',       title: 'Stillness at Dawn',         cat: 'Experiences', cats: ['experiences', 'wellness'] },
    { src: 'imageye___-_imgi_308_Amanbagh%2C India - Resort - Experience - Bhangarh Yoga.jpg', title: 'Meditative Mornings',   cat: 'Experiences', cats: ['experiences', 'wellness'] },

    { src: 'ancestral gardens.jpg',                                                       title: 'The Ancestral Gardens',     cat: 'Gardens & Pool', cats: ['gardens'] },
    { src: 'imageye___-_imgi_220_Amanbagh-Amansanti-Gardener_1.jpg',                      title: 'Tended by Hand',            cat: 'Gardens & Pool', cats: ['gardens'] },
    { src: 'imageye___-_imgi_94_Amanbagh-Amansanti-Gardener_1.jpg',                       title: 'Garden Keepers',            cat: 'Gardens & Pool', cats: ['gardens'] },
    { src: 'imageye___-_imgi_95_Amanbagh-Amansanti-Gardener_2.jpg',                       title: 'Morning Bloom',             cat: 'Gardens & Pool', cats: ['gardens'] },
    { src: 'imgi_107_pool-pavilion.jpg',                                                  title: 'The Pool Pavilion',         cat: 'Gardens & Pool', cats: ['gardens', 'wellness'] },

    { src: 'imageye___-_imgi_103_Amanbagh-Spa-Detail-India.jpg',                          title: 'Spa Sanctuary',             cat: 'Spa & Wellness', cats: ['wellness'] },
    { src: 'imageye___-_imgi_316_Amanbagh-Spa-Treatment.jpg',                             title: 'The Healing Touch',         cat: 'Spa & Wellness', cats: ['wellness'] },
    { src: 'imageye___-_imgi_391_Aman-i-Khas%2C India - Spa Exterior.jpg',                title: 'The Spa Retreat',           cat: 'Spa & Wellness', cats: ['wellness'] },
    { src: 'imageye___-_imgi_82_Amanbagh-Amansanti-Doctor.jpg',                           title: 'Ayurvedic Wisdom',          cat: 'Spa & Wellness', cats: ['wellness'] },
];

const imgUrl = (src) => 'images/' + src.split('/').map(encodeURIComponent).join('/');

const grid    = document.getElementById('grid');
const empty    = document.getElementById('empty');
const filters = document.getElementById('filters');
const search  = document.getElementById('search');

let activeCat = 'all';
let query     = '';

/* ---------- Build filter chips ---------- */
function thumbForCat(id) {
    if (id === 'all') return IMAGES[0].src;
    const hit = IMAGES.find(i => i.cats.includes(id));
    return hit ? hit.src : IMAGES[0].src;
}

function countForCat(id) {
    return id === 'all' ? IMAGES.length : IMAGES.filter(i => i.cats.includes(id)).length;
}

function buildFilters() {
    CATEGORIES.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'g-chip' + (c.id === 'all' ? ' active' : '');
        btn.dataset.cat = c.id;
        btn.innerHTML = `
            <img class="thumb" src="${imgUrl(thumbForCat(c.id))}" alt="" loading="lazy">
            <span class="label">${c.label}</span>
            <span class="count">${countForCat(c.id)}</span>`;
        btn.addEventListener('click', () => {
            activeCat = c.id;
            document.querySelectorAll('.g-chip').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            render();
        });
        filters.appendChild(btn);
    });
}

/* ---------- Render grid ---------- */
let visible = [];   // currently displayed list (for lightbox navigation)

function render() {
    const list = IMAGES.filter(i => {
        const catOk = activeCat === 'all' || i.cats.includes(activeCat);
        const q = query.trim().toLowerCase();
        const qOk = !q || i.title.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q)
                    || i.cats.some(c => c.includes(q));
        return catOk && qOk;
    });
    visible = list;

    grid.innerHTML = '';
    list.forEach((img, idx) => {
        const card = document.createElement('figure');
        card.className = 'g-card';
        card.style.animationDelay = Math.min(idx * 0.04, 0.6) + 's';
        card.innerHTML = `
            <img src="${imgUrl(img.src)}" alt="${img.title} — Diggi Palace, Jaipur" loading="lazy" decoding="async">`;
        card.addEventListener('click', () => openLightbox(idx));
        grid.appendChild(card);
    });

    empty.style.display = list.length ? 'none' : 'block';
}

/* ---------- Lightbox ---------- */
const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCat     = document.getElementById('lb-cat');
const lbTitle   = document.getElementById('lb-title');
let lbIndex = 0;

function openLightbox(idx) {
    lbIndex = idx;
    updateLightbox();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
}
function updateLightbox() {
    const img = visible[lbIndex];
    if (!img) return;
    lbImg.src = imgUrl(img.src);
    lbImg.alt = img.title;
    lbCat.textContent = img.cat;
    lbTitle.textContent = img.title;
}
function nav(dir) {
    lbIndex = (lbIndex + dir + visible.length) % visible.length;
    updateLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => nav(-1));
document.getElementById('lb-next').addEventListener('click', () => nav(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
});

/* ---------- Search ---------- */
search.addEventListener('input', e => { query = e.target.value; render(); });

/* ---------- Init ---------- */
buildFilters();
render();
