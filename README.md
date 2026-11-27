# Mico S. Alano — My Little Corner

A responsive, procedural 3D room portfolio built with React, Three.js, React Three Fiber, Drei, Tailwind CSS, and Vite. No external models, textures, fonts, or image assets are required.

## Run

```sh
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run preview` to preview it.

## Personalize

- Edit `src/data.js` for profile, projects, education, honors, skills, experience, and contact details.
- The downloadable résumé is `public/Mico-Alano-Resume.pdf`.
- Add optional `demo` and `github` URLs to project entries when available. Until then, each card offers a project-specific email inquiry.
- Portfolio content is based on Mico's supplied résumé; the corporate application is identified as internship work.

## Explore

### Living Engineering Lab

- **Lab Mode** adds teal circuit traces, wireframe overlays, and annotations while keeping the room's warm lighting.
- **Smart collar** opens an explicitly illustrative Meow Guardian demo with camera, GPS, and motion states. It does not access a camera, location, or live device.
- **Inside the chip** walks through an original schematic/layout/DRC-LVS illustration and links the experience to Xinyx training. No company layout is reproduced.
- **Scrapbook** opens the Xinyx photo collection; the graduation portrait is also displayed in the 3D wall frame.
- Each featured project has an expandable engineering story. The Xinyx learning-curve account reflects Mico's supplied explanation; other entries describe documented work and engineering tradeoffs without inventing metrics or personal challenges.
- **60-second tours** offer Software, Hardware, and full-room routes with camera focus, pause/resume, back/next, skip, and links into exhibits. Opening an exhibit exits the tour. Switching away from the page pauses it.
- **Reduce motion** respects the OS preference and can be toggled in the header. It stops cat motion, removes camera interpolation and hover easing, and makes tours manual.
- All exhibits are also available through keyboard-accessible buttons beneath the room.

For the current browser regression check, start `npm run preview`, then run `node qa-lab.mjs` (uses the locally installed Windows Chrome). It covers new exhibit controls, story links, timed/manual tours, OS motion preference, and 390px/320px layouts. `qa.mjs` checks the original room and Playground interactions.

The **Playground** navigation button and the three miniature models on the front-right project shelf open the Engineering Playground. Choose Hearth (refrigerator), Shelter (roof insulation), or Solaris (solar water heating), then launch the actual Render demo in a new tab. Each experiment includes a captured application preview, a guided prompt, and its GitHub source link. Demo metadata lives in `playground` in `src/data.js`; preview images are stored in `public/previews/`.

Click the monitors, diploma, corkboard, bookshelf, or cat. Drag to orbit within the room's front-facing limits, scroll/pinch to zoom, and use Reset view to return home. The cat cycles tips and jumps when clicked; enable audio for a synthesized meow. Day/night mode changes lighting. Bottom navigation provides keyboard access to all portfolio content. Dialogs support Escape, focus trapping, and focus restoration. If WebGL fails, navigation remains available.

## Structure

- `Room.jsx`: procedural furniture and room geometry
- `InteractiveObject.jsx`: hover animation, tooltips, and click interaction
- `CatMascot.jsx`: calico geometry, animation, tips, and audio
- `PortfolioModal.jsx`: accessible portfolio content panels
- `App.jsx`: scene, camera controls, lighting, and HUD

Static hosting output: `dist/`.

## Deploy on Render

Create a **Static Site** linked to `https://github.com/okimsz/Portfolio`:

- Branch: `main`
- Root directory: leave blank
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Alternatively, create a Render Blueprint from this repository; `render.yaml` includes the static hosting configuration. No environment variables or backend service are required.

Verified in headless Chrome at 1440×1000 and 390×844: WebGL rendering, monitor raycasting and hover tooltip, cat tip cycling, all five panels, dialog focus and Escape, night mode, and mobile overflow. Production build passes. Three.js produces a large-bundle advisory (about 319 KB gzip for the application bundle).
