import { MapMetadata, RoutePlan } from "../types/api";

export const fallbackMapMetadata: MapMetadata = {
  resort: {
    id: 1,
    slug: "flims-laax",
    name: "Flims Laax",
    country_code: "CH",
    center_lat: 46.835,
    center_lng: 9.24,
    supports_lift_status: false,
  },
  bbox: { south: 46.81, west: 9.18, north: 46.89, east: 9.32 },
  nodes: [
    { node_key: "laax-base", name: "Laax Base", node_type: "village", latitude: 46.806, longitude: 9.257 },
    { node_key: "curnius", name: "Curnius", node_type: "lift_top", latitude: 46.84, longitude: 9.246 },
    { node_key: "nagens", name: "Nagens", node_type: "lift_top", latitude: 46.869, longitude: 9.234 },
    { node_key: "flims-village", name: "Flims Village", node_type: "village", latitude: 46.834, longitude: 9.281 }
  ],
  edges: [],
};

export const fallbackRoutePlan: RoutePlan = {
  route_id: "local-preview",
  summary: {
    total_steps: 2,
    total_runs: 1,
    total_lifts: 1,
    estimated_vertical: 520,
    warnings: [],
  },
  steps: [
    {
      step_number: 1,
      edge_key: "lift-laax-curnius",
      name: "Laax-Curnius Gondola",
      edge_type: "lift",
      from_node_key: "laax-base",
      to_node_key: "curnius",
      lift_type: "gondola",
      vertical_drop: 0,
    },
    {
      step_number: 2,
      edge_key: "piste-curnius-flims",
      name: "Red 10",
      edge_type: "piste",
      from_node_key: "curnius",
      to_node_key: "flims-village",
      difficulty: "red",
      vertical_drop: 520,
    },
  ],
};
