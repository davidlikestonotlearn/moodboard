// All sample content and grid placement live here. Components only render props.
export const profile = { name: 'Alex', image: '/images/profile.jpg' };

export const tracks = [
  { id: 'nights', title: 'Nights', artist: 'Frank Ocean', artwork: '/images/blonde.jpg' },
  { id: 'good-days', title: 'Good Days', artist: 'SZA', artwork: '/images/good-days.jpg' },
  { id: 'pink-white', title: 'Pink + White', artist: 'Frank Ocean', artwork: '/images/blonde.jpg' },
];

// Widget dimensions are columns × rows. Any 1×1, 2×1, 1×2 or 2×2 widget
// can use the same components; keep placements inside the 2×4 grid.
export const boardItems = [
  { id: 'blonde', type: 'image', src: '/images/blonde.jpg', alt: 'Frank Ocean’s Blonde album cover', placement: { column: 1, row: 1, columns: 1, rows: 1 } },
  { id: 'portrait', type: 'image', src: '/images/frank-ocean.jpg', alt: 'Black and white portrait of Frank Ocean', position: '51% center', placement: { column: 2, row: 1, columns: 1, rows: 2 } },
  { id: 'sunset', type: 'image', src: '/images/sunset.jpg', alt: 'Warm orange sunset above silhouetted trees', position: 'center 55%', placement: { column: 1, row: 2, columns: 1, rows: 1 } },
  { id: 'playlist', type: 'playlist', label: 'On repeat — three favorite tracks', tracks, placement: { column: 1, row: 3, columns: 2, rows: 1 } },
  { id: 'ocean', type: 'image', src: '/images/ocean.jpg', alt: 'Sunlight catching the rolling ocean waves', placement: { column: 1, row: 4, columns: 1, rows: 1 } },
  { id: 'ctrl', type: 'image', src: '/images/ctrl.jpg', alt: 'SZA sitting among old computer monitors on the Ctrl album cover', placement: { column: 2, row: 4, columns: 1, rows: 1 } },
];

export const navigationItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'moodboards', label: 'Moodboards', icon: 'moodboards' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
