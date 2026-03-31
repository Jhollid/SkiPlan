# API Contracts

## `POST /api/auth/register`
- Request: email, password
- Response: bearer token

## `POST /api/auth/login`
- Request: email, password
- Response: bearer token

## `GET /api/resorts`
- Returns active resorts available in the MVP.

## `GET /api/resorts/{resortSlug}/map-metadata`
- Returns resort bbox, routable nodes, and graph edges for mobile rendering.

## `POST /api/routes/plan`
- Request:
  - `resort_slug`
  - `start_node_key`
  - `end_node_key`
  - `preferences.max_difficulty`
  - `preferences.excluded_lift_types`
  - `preferences.routing_style`
  - `preferences.avoid_repeats`
  - `preferences.favorite_runs`
- Response:
  - `route_id`
  - `summary.total_steps`
  - `summary.total_runs`
  - `summary.total_lifts`
  - `summary.estimated_vertical`
  - `summary.warnings`
  - ordered `steps`
