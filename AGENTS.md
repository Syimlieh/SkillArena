# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js Turbopack on port 3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

No test framework is configured. Node 20.x required.

# SkillArena UI Rules (Short + Neon)

## Core design direction
SkillArena should feel like a modern esports platform, not a basic dashboard.

Design must feel:
- neon
- competitive
- premium
- futuristic
- smooth and fast

Keep the UI clean, but add strong visual identity through glow, contrast, and motion.

## Visual style
Use dark surfaces as the base, then layer neon highlights on key UI.

Recommended accent style:
- neon cyan
- electric blue
- neon green
- violet/purple accents

Use neon effects only for emphasis, not everywhere.
The UI should feel premium and controlled, not noisy.

## Neon rules
Apply subtle neon glow to:
- primary buttons
- active tabs
- card borders on hover
- match status badges
- focused inputs
- key icons or stats

Effects to use:
- soft outer glow
- gradient borders
- subtle inner highlight
- faint glass + neon edge combination

Avoid:
- heavy blur everywhere
- large glowing shadows on every component
- too many bright colors in one section
- low contrast text over glow

## Components
### Cards
- Use darker card backgrounds with slightly brighter borders.
- Add a subtle neon border or glow on hover/focus.
- Important cards (live match, featured tournament, winner card) can have a stronger glow.

### Buttons
- Primary buttons should feel bright, energetic, and clickable.
- Use neon gradient or solid neon accent with soft glow.
- Secondary buttons should stay darker with only light border glow.

### Badges and pills
- Status like Live, Completed, Joined, Winner should use compact glowing badges.
- Keep them clean and readable, not oversized.

## Motion and animation
Use motion to make the platform feel alive, but keep it lightweight.

Preferred:
- Framer Motion for reveal, hover, small transitions
- CSS transforms for hover lift, scale, glow pulse
- subtle marquee, ticker, or live highlight motion
- smooth page and section transitions

Good animation ideas:
- cards lift slightly on hover
- neon border pulse for live items
- button glow intensifies on hover
- section content fades/slides in on scroll
- background glow or mesh moves very slowly

## Three.js / Spline / 3D (optional)
Use 3D only in a very limited way because performance is already a concern.

Allowed:
- one lightweight hero effect only
- subtle floating object, arena ring, trophy, or abstract gaming shape
- low-poly / minimal scene
- only on desktop if performance allows

Rules:
- lazy load it
- do not block first paint
- disable on low-end devices
- remove immediately if FPS drops

Default approach should still be:
- CSS + Framer Motion first
- pseudo-3D through gradients, lighting, depth, and motion

## Performance rules
- prioritize smooth interaction over visual complexity
- keep animations GPU-friendly (transform, opacity)
- avoid heavy continuous effects on many cards at once
- reduce blur, particles, and large box-shadows
- animate only key elements, not the whole page
- test mobile performance first, then enhance desktop

## Homepage direction
Homepage should feel more immersive.

Improve with:
- stronger hero with neon accent lighting
- featured tournament/live match strip
- better result cards with glow and hierarchy
- animated stats or counters
- clearer section spacing and stronger contrast

## Final rule for AI coding agents
When redesigning SkillArena:
- keep it modern and gaming-focused
- use neon accents carefully for identity
- prefer smooth lightweight motion
- use 3D only as a small optional enhancement
- never sacrifice performance for visual effects
