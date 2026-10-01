# Club XR Arcade

A headset-first catalog of 236 browser-based VR and WebXR experiences for the Software Engineering Club expo.

## Run locally

```bash
bun install
bun run dev
```

The Vinext development server requires Node.js 22.13 or newer. Bun is used for dependency management and production builds.

## Build

```bash
bun run build
```

The production bundle is written to `dist/`.

## Data

The source catalog lives in `data/experiences.json`. The interface handles missing descriptions and images, deduplicates visible tags, and limits the initial shelf to 24 games for headset performance.
