import { API_BASE_URL, fetchMapMetadata, fetchResorts, planRoute } from "../api/client";
import { fallbackMapMetadata, fallbackRoutePlan } from "../data/mockData";

const mockFetch = jest.fn();

describe("api client", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it("falls back to local resort data when fetching resorts fails", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));

    const resorts = await fetchResorts();

    expect(resorts).toEqual([fallbackMapMetadata.resort]);
  });

  it("requests map metadata from the correct endpoint", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => fallbackMapMetadata,
    });

    const metadata = await fetchMapMetadata("flims-laax");

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/resorts/flims-laax/map-metadata`, undefined);
    expect(metadata).toEqual(fallbackMapMetadata);
  });

  it("falls back to the preview route when planning fails", async () => {
    mockFetch.mockRejectedValue(new Error("planner unavailable"));

    const route = await planRoute({
      resort_slug: "flims-laax",
      start_node_key: "laax-base",
      end_node_key: "flims-village",
      preferences: {
        max_difficulty: "red",
        excluded_lift_types: [],
        routing_style: "fastest",
        avoid_repeats: true,
        favorite_runs: [],
      },
    });

    expect(route).toEqual(fallbackRoutePlan);
  });
});
