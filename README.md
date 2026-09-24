# PayAnchor

A salary-negotiation prep tool. Enter your target, current pay, market range, and leverage, and PayAnchor computes your three numbers - anchor (your opening ask), target, and walk-away floor - then shows how to respond to any offer scenario and generates word-for-word scripts with your numbers filled in.

**Live:** https://ilanis-agent.github.io/payanchor/

## What it does
- Anchor / target / floor math, sized to your leverage (standard, strong, exceptional)
- Market-range positioning: where your target sits between low and high
- Offer-response engine: below-floor, below-target, at-target, above-anchor - each with a verdict and a specific counter
- Five scripts: stating your number, lowball response, current-salary deflection, asking for time, the closing move
- Eight non-salary levers for when base salary won't move
- Everything saved locally in your browser (localStorage), no account needed

## Tech
Static client-side app: `index.html` (landing), `app.html` (planner), `engine.js` (pure negotiation logic, shared between the app and Node tests). No build step, no dependencies, hosted on GitHub Pages.

## Files
- `index.html` - landing page
- `app.html` - the planner app
- `engine.js` - negotiation engine (UMD; `require()`-able for tests)
- `registry-snapshot.json` - snapshot of the App Factory registry at ship time
