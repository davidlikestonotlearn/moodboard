# Moodboard

A mobile-first, presentational React prototype. All buttons are visual only. No backend, authentication, music service, navigation, or editing gestures are connected.

## Run

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; serve it with `npm run preview`.

## Replace the sample content

Edit `src/data/sampleContent.js` and replace assets in `public/images`. Each board item declares its starting column/row and column/row span. The board always has two columns and four rows. The reusable image and playlist widgets also support the other requested spans, including 2×2.

The board uses square grid cells sized to both viewport dimensions. The header and navigation remain outside the grid, and safe-area insets are added to the shell padding. On desktop, the app stays centered at a maximum width of 440px.

See `public/images/CREDITS.md` for sample image sources.
