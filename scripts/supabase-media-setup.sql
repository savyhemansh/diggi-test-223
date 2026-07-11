-- Media CMS setup. Run in Supabase Dashboard → SQL Editor → New Query.
-- Lets the admin app (admin/index.html) manage every photo/video on the site,
-- and lets the live site load current media without a redeploy.

create table if not exists media_slots (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  slot_key text not null unique,
  is_gallery boolean not null default false,
  media_type text not null default 'image', -- 'image' or 'video'
  created_at timestamptz not null default now()
);

create table if not exists media_items (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references media_slots(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  alt text default '',
  created_at timestamptz not null default now()
);

alter table media_slots enable row level security;
alter table media_items enable row level security;

-- Public site can read slot definitions and media (needed to render the live pages).
create policy "Public can read slots" on media_slots for select to anon using (true);
create policy "Public can read media" on media_items for select to anon using (true);

-- Only logged-in admin users can create/edit/delete.
create policy "Admins manage slots" on media_slots for all to authenticated using (true) with check (true);
create policy "Admins manage media" on media_items for all to authenticated using (true) with check (true);

-- Storage bucket for the actual files. Run this part, then also create the bucket
-- named "site-media" from Dashboard → Storage → New Bucket → Public bucket = ON
-- (bucket creation itself must be done via the dashboard or a service-role script,
-- the anon/authenticated keys cannot create buckets).

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public can view site-media" on storage.objects
  for select to anon using (bucket_id = 'site-media');

create policy "Admins can upload to site-media" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-media');

create policy "Admins can update site-media" on storage.objects
  for update to authenticated using (bucket_id = 'site-media');

create policy "Admins can delete site-media" on storage.objects
  for delete to authenticated using (bucket_id = 'site-media');

-- Seed the initial slots covering the highest-traffic images across the site.
-- The admin app can add more slots for anything not listed here ("+ New Slot").

insert into media_slots (page, section, slot_key, is_gallery, media_type) values
  ('index', 'Hero', 'index.hero', false, 'video'),
  ('index', 'Pet-Friendly Stay Panel', 'index.pet-friendly', false, 'image'),
  ('index', 'Restoration Ritual Panel', 'index.restoration-ritual', false, 'image'),
  ('events', 'Hero', 'events.hero', false, 'image'),
  ('events', 'Holi Gallery', 'events.holi', true, 'image'),
  ('events', 'Jaipur Literature Festival Gallery', 'events.jlf', true, 'image'),
  ('events', 'Rajasthan Heritage Week Gallery', 'events.heritage', true, 'image'),
  ('events', 'FDCI Showcases Gallery', 'events.fdci', true, 'image'),
  ('events', 'Grub Fest Gallery', 'events.grubfest', true, 'image'),
  ('events', 'Diwali Gallery', 'events.diwali', true, 'image'),
  ('events', 'New Year Gallery', 'events.newyear', true, 'image'),
  ('events', 'Jarocha Art Fest Gallery', 'events.artfest', true, 'image'),
  ('events', 'Music Concerts Gallery', 'events.music', true, 'image'),
  ('experiences', 'Hero', 'experiences.hero', false, 'video'),
  ('experiences', 'Terrace Baithak', 'experiences.terrace-baithak', false, 'image'),
  ('experiences', 'The Kitchen Table', 'experiences.kitchen-table', false, 'image'),
  ('experiences', 'Diggi Bagh Camel Safari', 'experiences.diggi-bagh-camel', false, 'image'),
  ('experiences', 'Diggi Bagh Organic Farming', 'experiences.diggi-bagh-farming', false, 'image'),
  ('stay', 'Hero', 'stay.hero', false, 'video'),
  ('contact', 'Hero', 'contact.hero', false, 'image'),

  ('baradari', 'Hero', 'baradari.hero', false, 'image'),
  ('baradari', 'Setting Gallery', 'baradari.setting-gallery', true, 'image'),
  ('baradari', 'Gourmet Plating', 'baradari.gourmet-plating', false, 'image'),
  ('baradari', 'Fresh Ingredients', 'baradari.fresh-ingredients', false, 'image'),

  ('la-brass', 'Hero', 'la-brass.hero', false, 'image'),
  ('la-brass', 'Ambiance Gallery', 'la-brass.ambiance-gallery', true, 'image'),
  ('la-brass', 'Gourmet Detail', 'la-brass.gourmet-detail', false, 'image'),
  ('la-brass', 'Atmosphere', 'la-brass.atmosphere', false, 'image'),

  ('culinary', 'Hero', 'culinary.hero', false, 'video'),
  ('culinary', 'Baradari Teaser', 'culinary.baradari-teaser', false, 'image'),
  ('culinary', 'La Brass Teaser', 'culinary.labrass-teaser', false, 'image'),
  ('culinary', 'Private Dining', 'culinary.private-dining', false, 'image'),
  ('culinary', 'Heritage Dining Setup', 'culinary.heritage-dining-setup', false, 'image'),
  ('culinary', 'Heritage Thali', 'culinary.heritage-thali', false, 'image'),
  ('culinary', 'Royal Court Cuisine', 'culinary.royal-court-cuisine', false, 'image'),
  ('culinary', 'Global Classics', 'culinary.global-classics', false, 'image'),

  ('celebrations', 'Hero', 'celebrations.hero', false, 'image'),
  ('celebrations', 'Centerpiece Video', 'celebrations.centerpiece-video', false, 'video'),
  ('celebrations', 'Durbar Hall Venue', 'celebrations.venue-durbar-hall', false, 'image'),
  ('celebrations', 'Zenana Courtyard Venue', 'celebrations.venue-zenana-courtyard', false, 'image'),
  ('celebrations', 'Green Sanctuary Venue', 'celebrations.venue-green-sanctuary', false, 'image'),
  ('celebrations', 'Setting Worthy', 'celebrations.setting-worthy', false, 'image'),
  ('celebrations', 'Invitation Detail', 'celebrations.invitation-detail', false, 'image'),
  ('celebrations', 'Collage 1', 'celebrations.collage-1', false, 'image'),
  ('celebrations', 'Collage 2', 'celebrations.collage-2', false, 'image'),
  ('celebrations', 'Collage 3', 'celebrations.collage-3', false, 'image'),
  ('celebrations', 'Collage 4', 'celebrations.collage-4', false, 'image'),
  ('celebrations', 'Collage 5', 'celebrations.collage-5', false, 'image'),
  ('celebrations', 'Collage 6', 'celebrations.collage-6', false, 'image'),

  ('history', 'Hero', 'history.hero', false, 'video'),
  ('history', 'Genesis', 'history.genesis', false, 'image'),
  ('history', 'Era Gallery', 'history.era-gallery', true, 'image'),
  ('history', 'Gallery 1', 'history.gallery-1', false, 'image'),
  ('history', 'Gallery 2', 'history.gallery-2', false, 'image'),
  ('history', 'Gallery 3', 'history.gallery-3', false, 'image'),
  ('history', 'Gallery 4', 'history.gallery-4', false, 'image'),

  ('sustainability', 'Quiet Practices 1', 'sustainability.quiet-1', false, 'image'),
  ('sustainability', 'Quiet Practices 2', 'sustainability.quiet-2', false, 'image'),
  ('sustainability', 'Quiet Practices 3', 'sustainability.quiet-3', false, 'image'),
  ('sustainability', 'Ancestral Gardens', 'sustainability.ancestral-gardens', false, 'image'),
  ('sustainability', 'Pet-Friendly Peacock', 'sustainability.pet-peacock', false, 'image'),
  ('sustainability', 'Pet-Friendly Dog', 'sustainability.pet-dog', false, 'image'),

  ('palace-suite', 'Hero', 'palace-suite.hero', false, 'image'),
  ('palace-suite', 'Balcony', 'palace-suite.balcony', false, 'image'),
  ('palace-suite', 'Lounge', 'palace-suite.lounge', false, 'image'),
  ('palace-suite', 'Cross-link: Courtyard Suite', 'palace-suite.crosslink-courtyard', false, 'image'),
  ('palace-suite', 'Cross-link: Heritage Deluxe', 'palace-suite.crosslink-heritage-deluxe', false, 'image'),
  ('palace-suite', 'Cross-link: Heritage Standard', 'palace-suite.crosslink-heritage-standard', false, 'image'),

  ('courtyard-suite', 'Hero', 'courtyard-suite.hero', false, 'image'),
  ('courtyard-suite', 'Room 1', 'courtyard-suite.room-1', false, 'image'),
  ('courtyard-suite', 'Room 2', 'courtyard-suite.room-2', false, 'image'),
  ('courtyard-suite', 'Cross-link: Heritage Deluxe', 'courtyard-suite.crosslink-heritage-deluxe', false, 'image'),
  ('courtyard-suite', 'Cross-link: Heritage Standard', 'courtyard-suite.crosslink-heritage-standard', false, 'image'),
  ('courtyard-suite', 'Cross-link: Palace Suite', 'courtyard-suite.crosslink-palace-suite', false, 'image'),

  ('heritage-deluxe', 'Hero', 'heritage-deluxe.hero', false, 'image'),
  ('heritage-deluxe', 'Room 1', 'heritage-deluxe.room-1', false, 'image'),
  ('heritage-deluxe', 'Room 2', 'heritage-deluxe.room-2', false, 'image'),
  ('heritage-deluxe', 'Cross-link: Courtyard Suite', 'heritage-deluxe.crosslink-courtyard-suite', false, 'image'),
  ('heritage-deluxe', 'Cross-link: Heritage Standard', 'heritage-deluxe.crosslink-heritage-standard', false, 'image'),
  ('heritage-deluxe', 'Cross-link: Palace Suite', 'heritage-deluxe.crosslink-palace-suite', false, 'image'),

  ('heritage-standard', 'Hero', 'heritage-standard.hero', false, 'image'),
  ('heritage-standard', 'Room 1', 'heritage-standard.room-1', false, 'image'),
  ('heritage-standard', 'Room 2', 'heritage-standard.room-2', false, 'image'),
  ('heritage-standard', 'Cross-link: Courtyard Suite', 'heritage-standard.crosslink-courtyard-suite', false, 'image'),
  ('heritage-standard', 'Cross-link: Heritage Deluxe', 'heritage-standard.crosslink-heritage-deluxe', false, 'image'),
  ('heritage-standard', 'Cross-link: Palace Suite', 'heritage-standard.crosslink-palace-suite', false, 'image'),

  ('mockreservation', 'Hero', 'mockreservation.hero', false, 'image'),
  ('mockreservation', 'Palace Suite Card', 'mockreservation.palace-suite', false, 'image'),
  ('mockreservation', 'Courtyard Suite Card', 'mockreservation.courtyard-suite', false, 'image'),
  ('mockreservation', 'Heritage Deluxe Card', 'mockreservation.heritage-deluxe', false, 'image'),

  ('blog', 'Post: 2-Day Itinerary', 'blog.post-2-day-itinerary', false, 'image'),
  ('blog', 'Post: Best Time to Visit', 'blog.post-best-time-visit', false, 'image'),
  ('blog', 'Post: Diggi Palace Architecture', 'blog.post-architecture', false, 'image'),
  ('blog', 'Post: Heritage Hotel Classification', 'blog.post-heritage-classification', false, 'image'),
  ('blog', 'Post: Heritage Hotels Guide', 'blog.post-heritage-hotels-guide', false, 'image'),
  ('blog', 'Post: Jaipur Festivals Calendar', 'blog.post-festivals-calendar', false, 'image'),
  ('blog', 'Post: Jaipur Literature Festival', 'blog.post-jlf-history', false, 'image'),
  ('blog', 'Post: Palace vs Haveli vs Fort', 'blog.post-palace-haveli-fort', false, 'image'),
  ('blog', 'Post: Palace Wedding Planning', 'blog.post-wedding-planning', false, 'image'),
  ('blog', 'Post: Rajasthani Thali Guide', 'blog.post-thali-guide', false, 'image'),

  ('blog-2-days-jaipur-itinerary', 'Hero', 'blog-2-days-jaipur-itinerary.hero', false, 'image'),
  ('blog-best-time-visit-jaipur', 'Hero', 'blog-best-time-visit-jaipur.hero', false, 'image'),
  ('blog-diggi-palace-architecture', 'Hero', 'blog-diggi-palace-architecture.hero', false, 'image'),
  ('blog-heritage-hotel-classification', 'Hero', 'blog-heritage-hotel-classification.hero', false, 'image'),
  ('blog-heritage-hotels-jaipur-guide', 'Hero', 'blog-heritage-hotels-jaipur-guide.hero', false, 'image'),
  ('blog-jaipur-festivals-calendar', 'Hero', 'blog-jaipur-festivals-calendar.hero', false, 'image'),
  ('blog-jaipur-literature-festival', 'Hero', 'blog-jaipur-literature-festival.hero', false, 'image'),
  ('blog-palace-haveli-fort-difference', 'Hero', 'blog-palace-haveli-fort-difference.hero', false, 'image'),
  ('blog-palace-wedding-planning-guide', 'Hero', 'blog-palace-wedding-planning-guide.hero', false, 'image'),
  ('blog-rajasthani-thali-guide', 'Hero', 'blog-rajasthani-thali-guide.hero', false, 'image')
on conflict (slot_key) do nothing;
