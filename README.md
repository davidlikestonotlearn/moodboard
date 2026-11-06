# Moodboard

A mobile-first React moodboard app with a small Node.js server. Home shows the last opened moodboard preview and an All Moodboards button. The button opens a list of board names with thumbnails of their first widget. Select a board to view it, or use the top-left back button to return Home. Create Moodboard asks for a name and opens an empty board; tap its grid to add the first widget. The three-dot menu lets you rename or delete a board. Privacy settings is a placeholder. Settings lets you choose Dark or Light mode; Dark is restored on refresh. Log out returns to the sign-in screen. On the Moodboards tab, hold any widget for 0.7 seconds or tap the organize icon to enter edit mode. Then drag a widget to move it, tap its × button to delete it, or tap Done to leave edit mode. Other widgets shift to keep the fixed grid aligned. Guest and email-account moodboards survive a page reload. There is no Spotify API integration.

The app opens on a visual sign-in screen inspired by the MUDO reference. Google and Apple buttons are placeholders. Continue with Email accepts an email and password. For a new address, the next screen asks for a name and optional profile photo before creating the account. Existing accounts log in with their password; a wrong password shows an inline error. New accounts start with no boards. Continue as guest creates or resumes a guest session with the sample boards. An account session resumes on refresh; guests see the welcome screen again and can continue to their saved boards. Log out returns to the start screen. The reference photo and custom logo are intentionally omitted until assets are supplied.

## Guest data

The Node server creates a random guest ID and stores it in a persistent, HTTP-only browser cookie. Moodboard names, widgets, positions, Spotify links, and uploaded image data are saved in `data/moodboards.sqlite` on the computer running the server. The `data/` directory is ignored by Git. Guest boards return in the same browser after refresh or reopening the browser, as long as the cookie and database file remain. Clearing the cookie or switching devices loses access to that guest's boards. This is local development storage; running the server on another computer uses a different database. Back up the database file if the boards matter to you.

Email accounts, their profile fields, and their moodboards are stored in the same SQLite file. Passwords are stored as salted hashes, and signed-in sessions use an HTTP-only cookie. Theme choice still resets on refresh. Google and Apple sign-in, email verification, and password recovery are not yet implemented. This is a local development server; online accounts across devices require hosting the server and its database.

Tap the header profile picture to open a full-height profile drawer. Edit the picture, name, and bio there, or open any of your moodboards from its list. Settings also has an Edit profile button that opens the drawer directly in edit mode. Account profile changes are saved; guest profile changes reset on refresh.

Home includes a GitHub-style daily login grid below All Moodboards, at the bottom of the page. All 13 weeks are empty sample data for now; it does not record visits yet.
The Privacy and Help buttons in Settings are presentational for now.

## Spotify links

There are three widget types: Image (no link), Song (artwork linked to a Spotify song or album), and Playlist (a whole-card link to a Spotify playlist). In edit mode, tap the link icon on a Song or Playlist to change its link. Paste a full `https://open.spotify.com/...` share link. Save to leave edit mode, then quickly tap the widget on the Moodboards tab to open Spotify. Holding a widget for 0.7 seconds enters edit mode instead. Links navigate the current tab to Spotify.

Tap Add in edit mode to choose a size, then a widget type, then its content. Sizes without a contiguous free spot are disabled. Image and Song widgets accept an uploaded image; Song also needs a Spotify link. Playlist is available only in the horizontal 2×1 or large 2×2 size. The 2×1 card displays up to three manually entered songs; the 2×2 card displays up to six at similar row spacing. Playlist needs a title and Spotify playlist link, and can use an uploaded cover. The optional Fetch Spotify art button asks Spotify's public oEmbed endpoint for a title and thumbnail. If the request is unavailable, upload an image instead. oEmbed does not provide the playlist's songs, so enter the rows manually. Uploads, links, movement, and deletion are saved to the current guest or account record.

## Run

Install Node.js 24.15 or newer first, then run these commands from the project folder in PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed in the terminal. Keep the terminal running while previewing; press Ctrl+C to stop it.

The one `dev` command starts both the React development server and the guest database server. Create a production build with `npm.cmd run build`; serve it locally with `npm.cmd run preview`. Building generates `dist/`, which can be removed and regenerated. Use the local URL to preview your edits rather than opening `index.html` directly.

## Project structure

- `src/`: React components, styles, and sample content. `App.jsx` manages the selected tab; `main.jsx` starts React.
- `server/`: Node API, guest and account storage, and password hashing.
- `tests/`: Tests for board behavior, Spotify helpers, and guest database storage.
- `data/`: Your local guest database, generated when the server starts and excluded from Git.
- `public/`: Images and fonts used by the UI.
- `index.html`: Vite's HTML entry point.
- `package.json` and `package-lock.json`: Dependencies and run commands.
- `vite.config.js`: React JSX build configuration.
- `node_modules/`: Installed dependencies; generated by `npm.cmd install` and excluded from Git.

## Replace the sample content

Edit `src/data/sampleContent.js` and replace assets in `public/images`. Each board item declares its starting column/row and column/row span. The board always has two columns and four rows. Image and Song widgets support all four sizes; Playlist uses 2×1 or 2×2.

`recentMoodboard` provides the initial Home preview for a new guest. After opening another board, Home shows that board instead. `HomePage` renders the Home sections, and `MoodboardPreview` crops the existing board to its top two rows so the preview uses the same arrangement.

Opening the recent preview selects its board, activates the middle Moodboards tab, and moves keyboard focus into the board content.

The `moodboards` array supplies the starting boards for a new guest. It contains the original board, a full keshi board, and a half-complete Taylor Swift and Ariana Grande board. After that, the guest database supplies the All Moodboards screen.

The board uses square grid cells sized to both viewport dimensions. The header and navigation remain outside the grid, and safe-area insets are added to the shell padding. On desktop, the app stays centered at a maximum width of 440px.

See `public/images/CREDITS.md` for sample image sources.
