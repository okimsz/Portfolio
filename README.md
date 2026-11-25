# My Little Corner

A responsive, procedural 3D room portfolio built with React, Three.js, React Three Fiber, Drei, Tailwind CSS, and Vite. No external models, textures, fonts, or image assets are required.

## Run

```sh
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run preview` to preview it.

## Personalize

- Edit `src/data.js` for name, role, projects, and social links.
- Edit `src/components/PortfolioModal.jsx` for education, biography, and experience.
- Replace `public/resume.txt` with your real resume (and update the download link if using PDF).
- Project demo and repository URLs are explicitly marked placeholders. Replace them before sharing as a personal portfolio.

## Explore

Click the monitors, diploma, corkboard, bookshelf, or cat. Drag to orbit within the room's front-facing limits, scroll/pinch to zoom, and use Reset view to return home. The cat cycles tips and jumps when clicked; enable audio for a synthesized meow. Day/night mode changes lighting. Bottom navigation provides keyboard access to all portfolio content. Dialogs support Escape, focus trapping, and focus restoration. If WebGL fails, navigation remains available.

## Structure

- `Room.jsx`: procedural furniture and room geometry
- `InteractiveObject.jsx`: hover animation, tooltips, and click interaction
- `CatMascot.jsx`: calico geometry, animation, tips, and audio
- `PortfolioModal.jsx`: accessible portfolio content panels
- `App.jsx`: scene, camera controls, lighting, and HUD

Static hosting output: `dist/`.
