import { fireEvent, render, screen } from "@testing-library/react-native";

import { HomeScreen } from "../screens/HomeScreen";
import { RecentRoute } from "../types/api";
import { UserPreferences } from "../types/app";

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

describe("HomeScreen", () => {
  it("shows an empty state when no routes exist", () => {
    render(
      <HomeScreen
        email="jack@example.com"
        preferences={preferences}
        recentRoutes={[]}
        onStartPlanning={jest.fn()}
        onEditPreferences={jest.fn()}
        onSelectRecentRoute={jest.fn()}
      />
    );

    expect(screen.getByText("Ready for the mountain")).toBeTruthy();
    expect(screen.getByText("No recent routes yet")).toBeTruthy();
  });

  it("renders recent routes and quick actions", () => {
    const onStartPlanning = jest.fn();
    const onEditPreferences = jest.fn();
    const onSelectRecentRoute = jest.fn();

    render(
      <HomeScreen
        email="jack@example.com"
        preferences={preferences}
        recentRoutes={[recentRoute]}
        onStartPlanning={onStartPlanning}
        onEditPreferences={onEditPreferences}
        onSelectRecentRoute={onSelectRecentRoute}
      />
    );

    fireEvent.press(screen.getByText("Start planning"));
    fireEvent.press(screen.getByText("Edit preferences"));
    fireEvent.press(screen.getByText("Tap to reuse this route setup"));

    expect(onStartPlanning).toHaveBeenCalled();
    expect(onEditPreferences).toHaveBeenCalled();
    expect(onSelectRecentRoute).toHaveBeenCalledWith(recentRoute);
  });

  it("surfaces the latest route as a resume shortcut", () => {
    const onSelectRecentRoute = jest.fn();

    render(
      <HomeScreen
        email="jack@example.com"
        preferences={preferences}
        recentRoutes={[recentRoute]}
        onStartPlanning={jest.fn()}
        onEditPreferences={jest.fn()}
        onSelectRecentRoute={onSelectRecentRoute}
      />
    );

    expect(screen.getByText("Last planned route")).toBeTruthy();
    fireEvent.press(screen.getByText("Resume last route"));

    expect(onSelectRecentRoute).toHaveBeenCalledWith(recentRoute);
  });
});
