# MapLibre Spike

## Goal
Validate whether Expo managed workflow is sufficient for the MVP map requirements:

- display resort geometry
- overlay planned routes
- support marker layering
- preserve a path toward offline tile packs

## Decision
Start in Expo for development speed, keep map rendering isolated behind `mobile/src/components/ResortMapCard.tsx`, and defer direct MapLibre package installation until a dedicated native compatibility spike is run.

## Why
- Expo is still the fastest way to bootstrap the mobile shell.
- Offline map packs and some native MapLibre integrations may require native configuration.
- Keeping map rendering isolated lets the rest of the route-planning flow proceed while the native mapping choice is tested.
- Current MapLibre React Native documentation indicates Expo support, but 2026 issue traffic still shows offline-pack instability on iOS beta builds.
- A fresh dependency install also surfaced version friction around React peer requirements, so the safest path is to finish the planner shell first and introduce the map package in a targeted spike.

## Exit Criteria
Stay on managed Expo only if a technical spike confirms:

- the chosen MapLibre package builds cleanly
- route overlays render reliably
- offline tile support is workable without brittle native hacks

If those checks fail, move to Expo bare workflow before deeper UI investment.
