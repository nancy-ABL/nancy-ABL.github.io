# Nancy Abdelaal — portfolio

Motion design, video edit and voice over, from Cairo.

A static site: `index.html`, `css/style.css`, `js/main.js` and the `media/` folder. No build step.

## Put it online with GitHub Pages

1. On github.com, create a new **public** repository. Name it `<your-username>.github.io` to get the address `https://<your-username>.github.io`, or give it any name to get `https://<your-username>.github.io/<name>`.
2. Push this folder to it:
   ```
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
   (Or use GitHub Desktop: File → Add local repository → choose this folder → Publish.)
3. In the repository, open **Settings → Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then save. The site goes live in a minute or two.

## Updating the work

- Videos live in `media/` as web-sized `.mp4` files, each with a `.jpg` poster frame of the same name.
- The list of clients, reels, typo pieces and voice-over demos is at the top of `js/main.js` (`CLIENTS`, `TYPO`, `VO`, `EDITS`). Add a line there to add a piece.
- Client logos are in `media/logo/` as transparent PNGs.
- To preview locally, run `python -m http.server` in this folder and open http://localhost:8000. The voice-over letters react to the real audio only when the site is served like this, or once it is online. Opened straight from the disk, they move to a simulated rhythm instead.
