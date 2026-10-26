# Photo Gallery

A React gallery styled with Tailwind CSS. The gallery uses one column on mobile,
two columns on tablet, and four columns on desktop. Each photo has a favourite
button in its lower-right corner, and cards reveal as they enter the viewport.

## Run the project

1. Install Node.js if it is not already installed.
2. Open a terminal in this folder (`my-react-app`).
3. Install the project dependencies:

   ```sh
   npm install
   ```

4. Start the local development server:

   ```sh
   npm run dev
   ```

5. Open the local URL printed by Vite in your browser. Stop the server with
   `Ctrl+C`.

To check the production build, run `npm run build`. To run the linter, run
`npm run lint`.

## Where the code is

- `src/App.jsx` renders the page, author search, and responsive photo grid.
- `src/components/PhotoCard.jsx` renders each image, favourite button, and
  scroll reveal.
- `src/hooks/useFetchPhotos.js` loads the gallery from the Picsum Photos API.
- `src/reducers/favouritesReducer.js` toggles and restores saved favourites.
- `src/index.css` imports Tailwind CSS; `vite.config.js` enables its Vite plugin.

The grid uses Tailwind's default breakpoints: one column by default, two at
`md`, and four at `lg`. Favourites are saved in the browser's local storage.
Photo loading requires an internet connection.
