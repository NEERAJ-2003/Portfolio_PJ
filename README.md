# Portfolio (React + Vite)

## Setup
```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
```

## Assets you need to add to `public/`
These were referenced by filename in the original HTML but weren't part of
the uploaded file, so they're not included here. Drop your existing files
into `public/` with these exact names and everything will pick them up:

- `favicon.png`
- `icon-192.png`
- `project_img.png` (Brain Tumor Detection project image)
- `Pooja_KP_Resume.pdf`

## What's included
- `src/components/` — one component per section (Navbar, Hero, About,
  Experience, Skills, Projects, Contact, Footer)
- `src/components/NeonReflex.jsx` — the Neon Reflex reaction mini-game, canvas
  reflex loop with speed/score tracking inside a `useEffect`
- `src/components/Chatbot.jsx` + `src/chatbot/chatbotEngine.js` — the Tina AI
  chatbot widget, with all keyword-matching logic (skills engine, contact
  engine, knowledge base, smalltalk) and custom AI logo
- `src/index.css` — Tailwind v4 theme with futuristic dark color tokens (#080B12, #101622, #22D3EE, #818CF8, #F1F5F9, #94A3B8)

## Notes on the port
- Tailwind v4 is used (`@tailwindcss/vite` plugin + `@theme` in `index.css`)
- `localStorage` for the reflex high score, the canvas game loop, and the typing effect are cleanly managed in React `useEffect` hooks.

