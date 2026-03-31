import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { fallbackRoutePlan } from "../data/mockData";
import { ResortPlannerScreen } from "../screens/ResortPlannerScreen";
import { UserPreferences } from "../types/app";
import { RecentRoute } from "../types/api";

jest.mock("../api/client", () => ({
  API_BASE_URL: "http://localhost:8000/api",
  fetchResorts: jest.fn(async () => {
    const { fallbackMapMetadata } = require("../data/mockData");
    return [fallbackMapMetadata.resort];
  }),
  fetchMapMetadata: jest.fn(async () => {
    const { fallbackMapMetadata } = require("../data/mockData");
    return fallbackMapMetadata;
  }),
  planRoute: jest.fn(async () => {
    const { fallbackRoutePlan } = require("../data/mockData");
    return fallbackRoutePlan;
  }),
}));

const client = jest.requireMock("../api/client") as {
  planRoute: jest.Mock;
};

const preferences: UserPreferences = {
  maxDifficulty: "red",
  excludedLiftTypes: ["t-bar"],
  routingStyle: "enjoyable",
  avoidRepeats: true,
  favoriteRuns: ["Red 10"],
};

const recentRoute: RecentRoute = {
  routeId: "recent-1",
  resortSlug: "flims-laax",
  resortName: "Flims Laax",
  startNodeKey: "laax-base",
  startLabel: "Laax Base",
  endNodeKey: "flims-village",
  endLabel: "Flims Village",
  totalSteps: 2,
  totalLifts: 1,
  totalRuns: 1,
  estimatedVertical: 520,
  createdAt: "just now",
};

describe("ResortPlannerScreen", () => {
  beforeEach(() => {
    client.planRoute.mockClear();
  });

  it("submits the selected route request and renders the itinerary", async () => {
    render(
      <ResortPlannerScreen
        preferences={preferences}
        sessionEmail="jack@example.com"
        onEditPreferences={jest.fn()}
        recentRoutes={[]}
        onRoutePlanned={jest.fn()}
        onSelectRecentRoute={jest.fn()}
        selectedRecentRoute={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Plan route")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Plan route"));

    await waitFor(() => {
      expect(client.planRoute).toHaveBeenCalledWith({
        resort_slug: "flims-laax",
        start_node_key: "laax-base",
        end_node_key: "flims-village",
        preferences: {
          max_difficulty: "red",
          excluded_lift_types: ["t-bar"],
          routing_style: "enjoyable",
          avoid_repeats: true,
          favorite_runs: ["Red 10"],
        },
      });
    });

    expect(screen.getByText("Route Summary")).toBeTruthy();
    expect(screen.getAllByText("Laax-Curnius Gondola").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Red 10").length).toBeGreaterThan(0);
  });

  it("shows and reuses a recent route entry", async () => {
    const onSelectRecentRoute = jest.fn();
    const onRoutePlanned = jest.fn();

    render(
      <ResortPlannerScreen
        preferences={preferences}
        sessionEmail="jack@example.com"
        onEditPreferences={jest.fn()}
        recentRoutes={[recentRoute]}
        onRoutePlanned={onRoutePlanned}
        onSelectRecentRoute={onSelectRecentRoute}
        selectedRecentRoute={recentRoute}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Recent Routes")).toBeTruthy();
      expect(screen.getByText("Tap to reuse this route setup")).toBeTruthy();
      expect(
        screen.getByText(
          "Working from a reused route setup. Review the resort, start point, and destination before replanning."
        )
      ).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Tap to reuse this route setup"));

    expect(onSelectRecentRoute).toHaveBeenCalledWith(recentRoute);

    fireEvent.press(screen.getByText("Plan route"));

    await waitFor(() => {
      expect(onRoutePlanned).toHaveBeenCalledWith({
        routeId: fallbackRoutePlan.route_id,
        resortSlug: "flims-laax",
        resortName: "Flims Laax",
        startNodeKey: "laax-base",
        startLabel: "Laax Base",
        endNodeKey: "flims-village",
        endLabel: "Flims Village",
        totalSteps: 2,
        totalLifts: 1,
        totalRuns: 1,
        estimatedVertical: 520,
        createdAt: "just now",
      });
    });
  });
});
