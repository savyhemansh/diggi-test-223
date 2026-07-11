// Loads current media from Supabase for the page it runs on.
// Single-image slots: swaps the src of any element with matching data-media-slot.
// Gallery slots: populates window.__mediaGalleries[slot_key] = [{url, alt}, ...]
// and fires a "media-galleries-ready" event once done. If a slot has no rows in
// Supabase yet (nothing uploaded), existing hardcoded content is left untouched.
(function () {
    async function loadMedia() {
        const page = document.body.dataset.page;
        if (!page || typeof supabaseClient === 'undefined') return;

        const { data: slots, error: slotsError } = await supabaseClient
            .from('media_slots')
            .select('id, slot_key, is_gallery')
            .eq('page', page);

        if (slotsError || !slots || !slots.length) return;

        const slotIds = slots.map(s => s.id);
        const { data: items, error: itemsError } = await supabaseClient
            .from('media_items')
            .select('slot_id, public_url, alt, sort_order')
            .in('slot_id', slotIds)
            .order('sort_order', { ascending: true });

        if (itemsError) return;

        window.__mediaGalleries = window.__mediaGalleries || {};

        slots.forEach(slot => {
            const slotItems = (items || []).filter(i => i.slot_id === slot.id);
            if (!slotItems.length) return;

            if (slot.is_gallery) {
                window.__mediaGalleries[slot.slot_key] = slotItems.map(i => i.public_url);
            } else {
                const el = document.querySelector('[data-media-slot="' + slot.slot_key + '"]');
                if (el) el.src = slotItems[0].public_url;
            }
        });

        document.dispatchEvent(new CustomEvent('media-galleries-ready'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadMedia);
    } else {
        loadMedia();
    }
})();
