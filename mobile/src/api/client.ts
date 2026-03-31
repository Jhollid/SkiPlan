import { fallbackMapMetadata, fallbackRoutePlan } from "../data/mockData";
import { MapMetadata, ResortSummary, RoutePlan } from "../types/api";

const API_BASE_URL = "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export function fetchResorts(): Promise<ResortSummary[]> {
  return request<ResortSummary[]>("/resorts", undefined, [fallbackMapMetadata.resort]);
}

export function fetchMapMetadata(resortSlug: string): Promise<MapMetadata> {
  return request<MapMetadata>(`/resorts/${resortSlug}/map-metadata`, undefined, fallbackMapMetadata);
}

export function planRoute(payload: {
  resort_slug: string;
  start_node_key: string;
  end_node_key: string;
  preferences: {
    max_difficulty: string;
    excluded_lift_types: string[];
    routing_style: string;
    avoid_repeats: boolean;
    favorite_runs: string[];
  };
}): Promise<RoutePlan> {
  return request<RoutePlan>(
    "/routes/plan",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    fallbackRoutePlan
  );
}

export { API_BASE_URL };
