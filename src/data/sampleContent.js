// All sample content and grid placement live here. Components only render props.
export const profile = { name: 'Alex', bio: 'Music, memories, and moments.', image: '/images/chrome-heart-avatar.png' };

export const tracks = [
  { id: 'nights', title: 'Nights', artist: 'Frank Ocean', artwork: '/images/blonde.jpg' },
  { id: 'good-days', title: 'Good Days', artist: 'SZA', artwork: '/images/good-days.jpg' },
  { id: 'pink-white', title: 'Pink + White', artist: 'Frank Ocean', artwork: '/images/blonde.jpg' },
];

// Widget dimensions are columns × rows. Any 1×1, 2×1, 1×2 or 2×2 widget
// can use the same components; keep placements inside the 2×4 grid.
export const boardItems = [
  { id: 'blonde', type: 'song', src: '/images/blonde.jpg', alt: 'Frank Ocean’s Blonde album cover', placement: { column: 1, row: 1, columns: 1, rows: 1 } },
  { id: 'portrait', type: 'image', src: '/images/frank-ocean.jpg', alt: 'Black and white portrait of Frank Ocean', position: '51% center', placement: { column: 2, row: 1, columns: 1, rows: 2 } },
  { id: 'sunset', type: 'image', src: '/images/sunset.jpg', alt: 'Warm orange sunset above silhouetted trees', position: 'center 55%', placement: { column: 1, row: 2, columns: 1, rows: 1 } },
  { id: 'playlist', type: 'playlist', label: 'On repeat — three favorite tracks', tracks, placement: { column: 1, row: 3, columns: 2, rows: 1 } },
  { id: 'ocean', type: 'image', src: '/images/ocean.jpg', alt: 'Sunlight catching the rolling ocean waves', placement: { column: 1, row: 4, columns: 1, rows: 1 } },
  { id: 'ctrl', type: 'song', src: '/images/ctrl.jpg', alt: 'SZA sitting among old computer monitors on the Ctrl album cover', placement: { column: 2, row: 4, columns: 1, rows: 1 } },
];

// A static recent board for Home until saved boards are available.
export const recentMoodboard = {
  id: 'golden-hour',
  title: 'Golden hour',
  items: boardItems,
};

const keshiTracks = [
  { id: 'keshi-soft-spot', title: 'Soft Spot', artist: 'keshi', artwork: '/images/keshi-requiem.jpg' },
  { id: 'keshi-understand', title: 'UNDERSTAND', artist: 'keshi', artwork: '/images/keshi-gabriel.jpg' },
  { id: 'keshi-limbo', title: 'LIMBO', artist: 'keshi', artwork: '/images/keshi-gabriel.jpg' },
];

export const keshiMoodboard = {
  id: 'keshi-after-dark',
  title: 'Keshi after dark',
  items: [
    { id: 'keshi-gabriel', type: 'song', src: '/images/keshi-gabriel.jpg', alt: 'keshi on the GABRIEL album cover', placement: { column: 1, row: 1, columns: 1, rows: 1 } },
    { id: 'keshi-requiem', type: 'song', src: '/images/keshi-requiem.jpg', alt: 'Silhouetted figure on the Requiem album cover', placement: { column: 2, row: 1, columns: 1, rows: 2 } },
    { id: 'chrome-heart', type: 'image', src: '/images/chrome-heart-avatar.png', alt: 'Ornate silver heart and gothic cross on black', placement: { column: 1, row: 2, columns: 1, rows: 1 } },
    { id: 'keshi-playlist', type: 'playlist', label: 'Late night keshi', tracks: keshiTracks, placement: { column: 1, row: 3, columns: 2, rows: 1 } },
    { id: 'keshi-ocean', type: 'image', src: '/images/ocean.jpg', alt: 'Waves catching the light', placement: { column: 1, row: 4, columns: 1, rows: 1 } },
    { id: 'keshi-sunset', type: 'image', src: '/images/sunset.jpg', alt: 'Orange sunset above the trees', placement: { column: 2, row: 4, columns: 1, rows: 1 } },
  ],
};

const popTracks = [
  { id: 'lavender-haze', title: 'Lavender Haze', artist: 'Taylor Swift', artwork: '/images/taylor-midnights.jpg' },
  { id: 'anti-hero', title: 'Anti-Hero', artist: 'Taylor Swift', artwork: '/images/taylor-midnights.jpg' },
  { id: 'eternal-sunshine', title: 'eternal sunshine', artist: 'Ariana Grande', artwork: '/images/ariana-eternal-sunshine.jpg' },
];

// The lower two rows are intentionally open so this sample board is half complete.
export const popMoodboard = {
  id: 'midnight-sunshine',
  title: 'Midnight sunshine',
  items: [
    { id: 'taylor-midnights', type: 'song', src: '/images/taylor-midnights.jpg', alt: 'Taylor Swift on the Midnights album cover', placement: { column: 1, row: 1, columns: 1, rows: 1 } },
    { id: 'ariana-eternal-sunshine', type: 'song', src: '/images/ariana-eternal-sunshine.jpg', alt: 'Ariana Grande on the eternal sunshine album cover', placement: { column: 2, row: 1, columns: 1, rows: 1 } },
    { id: 'pop-playlist', type: 'playlist', label: 'Midnight sunshine songs', tracks: popTracks, placement: { column: 1, row: 2, columns: 2, rows: 1 } },
  ],
};

// Add future sample boards here to include them on the All Moodboards screen.
export const moodboards = [recentMoodboard, keshiMoodboard, popMoodboard];

export const emptyMoodboardTemplate = {
  title: 'Untitled Moodboard',
  items: [],
};

export const navigationItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'moodboards', label: 'Moodboards', icon: 'moodboards' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
