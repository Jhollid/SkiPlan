# PRD: Ski Slope Planning & Navigation App

---

## Problem Statement

Skiers and snowboarders in European Alpine resorts lack a digital tool for planning their day on the mountain. Paper piste maps are static, have no awareness of user skill level or preferences, cannot account for closed lifts, and offer no way to coordinate with friends across a large resort. Planning a logical sequence of runs to reach a lunch village, a snow park, or a meeting point with friends requires significant mental effort and local knowledge — particularly for visitors who are unfamiliar with the resort layout. There is currently no app that combines preference-aware route planning, friend coordination, and resort business discovery into a single cohesive experience.

---

## Solution

A mobile app (iOS and Android) for European Alpine ski resorts that allows skiers and snowboarders to plan curated sequences of runs before or during their ski day. Users input a destination (a village, a lift, a restaurant, or a friend's location) and the app produces a step-by-step plan of pistes and lifts to take, filtered by their personal preferences (difficulty, lift type, favourite runs, routing style). Groups of friends on the same trip can share on-demand locations and use the app to find natural meeting points or route to each other. Resort businesses can advertise within the app with direct "take me there" routing to their location.

---

## User Stories

### Onboarding & Preferences

1. As a new user, I want to register with my email and password, so that I have a personal account that saves my settings.
2. As a new user, I want to complete a short onboarding questionnaire, so that the app understands my skiing preferences before I use it for the first time.
3. As a new user, I want to select my maximum difficulty level (blue, red, black), so that the app never routes me down a slope I am not comfortable with.
4. As a new user, I want to indicate which lift types I want to avoid (e.g. T-bar, button lifts), so that planned routes respect my physical limitations or preferences.
5. As a new user, I want to choose my routing style (fastest route vs. most enjoyable/most vertical), so that the app plans routes aligned with what I value in a ski day.
6. As a new user, I want to indicate whether I prefer to avoid repeating the same run in a single plan, so that my day feels varied.
7. As a returning user, I want my preferences to be remembered from my last session on the same device, so that I do not have to re-enter them each day.

### Resort Selection & Map

8. As a user, I want to select a ski resort from a list of supported European Alpine resorts, so that I can plan my day at the correct mountain.
9. As a user, I want to see a rendered map of the selected resort showing all pistes, lifts, villages, and points of interest, so that I can visually understand the resort layout.
10. As a user, I want pistes on the map to be colour-coded by difficulty (green/blue/red/black), so that I can quickly identify which runs suit my level.
11. As a user, I want to see which lifts are currently open or closed on the map, so that I can account for closures in my planning.
12. As a user, I want closed lifts to be visually distinct (greyed out or marked), so that I don't accidentally plan a route that relies on a closed lift.
13. As a user, I want the resort map to be available offline once downloaded, so that I can reference it in areas with no mobile signal.

### Route Planning

14. As a user, I want to set a starting point on the resort map (a lift station, top of a run, or village), so that my route plan begins from where I actually am.
15. As a user, I want to set a destination (a village, a restaurant, a lift, or a point on the map), so that the app plans a route to get me there.
16. As a user, I want the app to generate a step-by-step plan of named pistes and lifts to reach my destination, so that I know exactly what to ski in what order.
17. As a user, I want the app to respect my difficulty preferences when generating a route, so that I am never routed down a slope harder than my selected maximum.
18. As a user, I want the app to respect my lift type exclusions when generating a route, so that routes never include lift types I have opted out of.
19. As a user, I want the app to apply my routing style preference (fastest vs. most enjoyable) when generating a route, so that the plan fits my priorities for the day.
20. As a user, I want the option to regenerate or adjust a route if I am not happy with the first suggestion, so that I have control over my plan.
21. As a user, I want to mark specific named runs as favourites, so that the app prioritises including them in planned routes where they logically fit.
22. As a user, I want to see an overview of my planned route before committing to it (total number of runs, lifts, approximate vertical drop), so that I can decide if it suits my goals.
23. As a user, I want the planned route to avoid repeating the same run where possible if I have enabled that preference, so that my day is varied.
24. As a user, I want to be able to plan multiple sequential routes in a day (e.g. morning run to lunch village, afternoon run to end village), so that I can structure my full day on the mountain.

### Offline & Downloadable Plans

25. As a user, I want to download a route plan before leaving the hotel so it is accessible without mobile signal, so that I can follow the plan on the slope.
26. As a user, I want to see a static image of the resort piste map with my planned route highlighted on it, so that I can reference it as I ski without needing to interact with the app.
27. As a user, I want the steps of my planned route to be numbered on the static map image and in the step list, so that I can cross-reference them easily.
28. As a user, I want to download the resort piste map for offline use, so that I can browse the full map without signal.

### Groups & Friend Coordination

29. As a user, I want to create a trip group and invite friends by their app username or email, so that we are connected within the app for the duration of our ski trip.
30. As a user, I want the group to have a maximum active duration of one week, after which it automatically disbands, so that location sharing does not persist beyond the trip.
31. As a user, I want to receive a notification when someone invites me to a group, so that I can accept or decline promptly.
32. As a user, I want to see a list of all members of my current group, so that I know who I am connected with.
33. As a user, I want to ping a friend's location on-demand, so that I can request their current GPS position without continuous tracking.
34. As a user, I want to be notified when a friend pings my location, so that I am aware my position has been shared.
35. As a user, I want to see a friend's last known location plotted on the resort map, so that I have a visual sense of where they are on the mountain.
36. As a user, I want to use "Take Me to Them" for any friend in my group, so that the app plots a step-by-step route from my location to theirs.
37. As a user, I want the "Take Me to Them" route to respect my difficulty and lift preferences, so that I am not routed down unsuitable terrain to reach a friend.
38. As a user, I want to use "Meet in the Middle" for any friend in my group, so that the app suggests a logical midpoint both of us can ski to.
39. As a user, I want the "Meet in the Middle" suggestion to default to the quickest meeting point (either a lift base or a village), so that we minimise waiting time.
40. As a user, I want to be able to choose between a village or a lift station as the meeting point in "Meet in the Middle", so that we can agree to wait somewhere comfortable.
41. As a user, I want both parties to receive the route plan when a "Meet in the Middle" is calculated, so that we each know how to get there.
42. As a user, I want to leave a group manually before the week expires, so that I can stop sharing my location if my plans change.
43. As a user, I want the group and all associated location data to be permanently deleted after the group disbands, so that my privacy is protected.

### Venue Discovery & Advertising

44. As a user, I want to see on-slope restaurants, bars, and businesses marked on the resort map, so that I can discover options for food and drink.
45. As a user, I want to tap on a venue marker to see its name, a short description, and any current promotions or events, so that I can decide if I want to visit.
46. As a user, I want to use "Take Me There" on any venue to get a step-by-step route to that business, so that I can plan my route to it efficiently.
47. As a user, I want venue routes to respect my difficulty and lift preferences, so that the route to a restaurant is no harder than I am comfortable with.
48. As a user, I want to see sponsored venue cards in the app feed, so that I can discover businesses that are actively promoting themselves.
49. As a resort business owner, I want to create a listing for my venue within the app, so that skiers can discover my restaurant, bar, or event.
50. As a resort business owner, I want to post events or daily specials that appear in the venue detail view, so that I can attract skiers on the day.

---

## Implementation Decisions

### Tech Stack

- **Mobile:** React Native (with Expo) — cross-platform iOS and Android, aligns with the developer's existing React knowledge.
- **Map Rendering:** MapLibre GL (React Native MapLibre) — open source, works natively with OSM vector tiles, supports offline tile packs.
- **Backend:** Python (FastAPI) — aligns with developer knowledge, performant for API workloads, good geospatial library support.
- **Database:** PostgreSQL with the PostGIS extension — industry standard for geospatial data, supports spatial queries (nearest node, bounding box, route graph storage).
- **Cache Layer:** Redis — for caching lift status, friend location pings, and frequently queried resort graphs.
- **Authentication:** JWT-based email/password auth, issued and verified by the backend.
- **Ads:** Google AdMob for standard mobile ads; a custom lightweight CMS within the backend for venue/sponsor listings.
- **Resort Data Source:** OpenStreetMap, queried via the Overpass API. Data is ingested, cleaned, and stored in PostGIS — the app does not query Overpass at runtime.
- **Lift Status:** Third-party APIs (Liftie, SkiAPI) where coverage exists; fallback to resort-specific sources or manual status flags.

### Modules

#### 1. OSM Data Ingestion & Resort Graph Builder
A backend pipeline that queries the Overpass API for a given resort bounding box, extracts piste and lift data, and builds a weighted directed graph. Nodes represent meaningful stop points (lift base, lift top, village, piste junction). Edges represent pistes (with difficulty, name, geometry) and lifts (with type, direction). The graph is persisted in PostGIS. This module runs offline as a data pipeline job, not at user request time. It is the foundation for all route planning.

#### 2. Route Planning Engine
A backend service that accepts a start node, end node, and a user preference profile and returns an ordered list of edges (piste steps + lift steps) forming the optimal route. Implements a weighted shortest-path algorithm (A* or Dijkstra) over the resort graph. Preference weights are applied at query time: closed lifts are set to infinite weight, excluded lift types are removed, difficulty-violating edges are removed, favourite run edges get a bonus weight, and the routing style (fastest vs. enjoyable) adjusts the base cost function. Run-repeat avoidance is implemented as a post-processing pass or via edge penalty. This module is entirely stateless and testable with synthetic graph inputs.

#### 3. Lift Status Service
A background service that periodically polls supported lift status APIs for each active resort and writes open/closed status to the cache and database. Exposes a simple interface: given a lift ID, return its current status. The route planning engine reads from this service when constructing the graph for a query. Degrades gracefully: if status is unknown, the lift is treated as open.

#### 4. User & Authentication Service
Manages user registration, login, JWT issuance and verification, and the user preference profile (difficulty level, excluded lift types, routing style, repeat-run preference, favourite runs). Preferences are stored per-user on the backend (device-local for v1 if preferred, but backend storage is cleaner). Exposes standard REST endpoints for auth and profile management.

#### 5. Group & Location Service
Manages the lifecycle of trip groups: creation, invitation, acceptance, membership, and automatic expiry (maximum 7 days). Handles on-demand location pings: when user A requests friend B's location, a push notification is sent to B's device, B's app responds with their current GPS coordinate, and the coordinate is stored ephemerally in Redis with a short TTL. Implements "Take Me to Them" by passing the friend's coordinates as the destination to the Route Planning Engine. Implements "Meet in the Middle" by running two shortest-path queries (one per party) against a shared candidate set of meeting nodes (lift bases and village nodes) and selecting the node that minimises the sum of both travel costs, with optional filtering for village-only nodes. All group and location data is hard-deleted on group disbandment.

#### 6. Offline Package Service
A backend endpoint that, given a route plan ID, generates a downloadable offline package. The package contains: the ordered step list (plain text / JSON), and a rendered static PNG of the resort map with the route highlighted and steps numbered. The map image is generated server-side using a headless renderer (e.g. MapLibre GL Native or a canvas-based renderer) applied to the OSM vector data. The client stores this package locally and renders it without a network connection.

#### 7. Venue & Ad Module
A lightweight CMS in the backend for resort venue listings. Each venue is a named point of interest with a geolocation, description, contact details, and optional event/special entries. Venue nodes are inserted into the resort graph so the Route Planning Engine can route to them directly. The mobile client displays venue markers on the map, a venue detail view, and a sponsored venue card feed. AdMob integration handles standard ad placements.

#### 8. Map Rendering Layer (Mobile)
The mobile-side module responsible for displaying the resort map, overlaying route highlights, showing numbered step markers, showing friend location pins, and showing venue markers. Built on MapLibre GL with offline tile support. Communicates with all other modules via the app's API client.

---

## Testing Decisions

**What makes a good test:** Tests should assert on observable outputs given defined inputs — they should not test internal implementation details or private methods. A good test for the Route Planning Engine, for example, asserts that given a specific graph and preference profile, the returned route contains only edges that satisfy the constraints — it does not assert which internal algorithm variant was used.

**Modules to test:**

- **Route Planning Engine** — highest priority. Pure function: graph + preferences → route. Test with synthetic graphs: verify difficulty constraints are respected, closed lifts are excluded, excluded lift types are absent from result, favourite runs appear where path-optimal, fastest vs. enjoyable produces different results on the same graph, repeat-run avoidance reduces duplicates.
- **Meet in the Middle Algorithm** — test that the selected meeting node genuinely minimises combined travel cost for both parties across a range of synthetic graph topologies.
- **Lift Status Service** — test that open/closed status correctly propagates to edge weights in the graph, and that unknown status defaults to open.
- **Group Lifecycle** — test that groups expire correctly after 7 days, that location data is deleted on disbandment, and that users outside a group cannot access location data.
- **OSM Graph Builder** — test that raw OSM feature data is correctly transformed into graph nodes and edges, with correct difficulty mapping, lift type tagging, and directional edges.
- **Offline Package Service** — test that the generated package contains the correct number of steps matching the route, and that the static image is produced without error for a known route.

---

## Out of Scope

- **Lift wait times** — real-time wait time data is not publicly available for most resorts; v1 will only show open/closed status.
- **Nordic / cross-country skiing** — the routing model is designed for downhill (piste) skiing only.
- **Real-time / continuous GPS tracking** — location sharing is on-demand ping only; no live tracking stream.
- **Turn-by-turn on-slope navigation** — the app is a planning tool, not a real-time GPS navigator. It does not issue instructions while the user is actively skiing a run.
- **User-generated piste corrections / editing** — users cannot edit or contribute to the resort graph in v1.
- **Social features beyond groups** — no public profiles, no activity feeds, no follower system.
- **Snow conditions / piste grooming data** — out of scope for v1.
- **Non-European resorts** — initial dataset is limited to European Alpine resorts.
- **Persistent user preferences across devices** — preferences are device-local in v1.
- **In-app payments or booking** — venue discovery is informational only; no transaction layer.
- **Resort business self-service portal** — venue listings are managed manually by the app operator in v1.

---

## Further Notes

- **OSM data quality must be validated for each resort before launch.** Flims Laax (Weisse Arena) should be the first resort verified via Overpass Turbo. Any gaps in piste or lift data will need to be manually corrected in OSM before that resort is supported.
- **The resort graph should be re-ingested nightly** to pick up any OSM edits, and lift status should be polled at a cadence appropriate to the status API's rate limits (likely every 5–15 minutes).
- **Privacy is a first-class concern** in the Groups module given the location data involved. All location data should be treated as sensitive: transmitted over TLS, stored only ephemerally in Redis, and hard-deleted on group expiry. GDPR compliance is required given the European target market.
- **Apple App Store policy requires Sign in with Apple** if any third-party social login is offered. Since v1 uses only email/password, this is not yet a concern — but worth noting for any future OAuth additions.
- **React Native with Expo** is recommended as the starting point for solo development velocity. If MapLibre or offline tile requirements hit limitations in Expo's managed workflow, ejecting to bare workflow is a known and documented path.
