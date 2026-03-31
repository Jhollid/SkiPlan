export type ResortSummary = {
  id: number;
  slug: string;
  name: string;
  country_code: string;
  center_lat: number;
  center_lng: number;
  supports_lift_status: boolean;
};

export type MapNode = {
  node_key: string;
  name: string;
  node_type: string;
  latitude: number;
  longitude: number;
};

export type MapEdge = {
  edge_key: string;
  from_node_key: string;
  to_node_key: string;
  name: string;
  edge_type: string;
  difficulty?: string | null;
  lift_type?: string | null;
  is_open?: boolean | null;
  geometry_json: {
    type: string;
    coordinates: number[][];
  };
};

export type MapMetadata = {
  resort: ResortSummary;
  bbox: Record<string, number>;
  nodes: MapNode[];
  edges: MapEdge[];
};

export type RouteStep = {
  step_number: number;
  edge_key: string;
  name: string;
  edge_type: string;
  from_node_key: string;
  to_node_key: string;
  difficulty?: string | null;
  lift_type?: string | null;
  vertical_drop: number;
};

export type RoutePlan = {
  route_id: string;
  summary: {
    total_steps: number;
    total_runs: number;
    total_lifts: number;
    estimated_vertical: number;
    warnings: string[];
  };
  steps: RouteStep[];
};
