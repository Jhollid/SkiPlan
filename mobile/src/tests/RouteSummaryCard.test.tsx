import { render, screen } from "@testing-library/react-native";

import { RouteSummaryCard } from "../components/RouteSummaryCard";
import { fallbackRoutePlan } from "../data/mockData";


describe("RouteSummaryCard", () => {
  it("renders route endpoints and metrics", () => {
    render(
      <RouteSummaryCard
        routePlan={fallbackRoutePlan}
        startNodeLabel="Laax Base"
        endNodeLabel="Flims Village"
      />
    );

    expect(screen.getByText("Laax Base")).toBeTruthy();
    expect(screen.getByText("Flims Village")).toBeTruthy();
    expect(screen.getByText("520m")).toBeTruthy();
    expect(screen.getByText("Lift")).toBeTruthy();
    expect(screen.getByText("Piste")).toBeTruthy();
  });

  it("shows reused route context and warnings", () => {
    render(
      <RouteSummaryCard
        routePlan={{
          ...fallbackRoutePlan,
          summary: {
            ...fallbackRoutePlan.summary,
            warnings: ["No valid route found with the selected preferences."],
          },
        }}
        startNodeLabel="Laax Base"
        endNodeLabel="Flims Village"
        isReusedRoute
      />
    );

    expect(screen.getByText("This itinerary was created from a reused recent-route setup.")).toBeTruthy();
    expect(screen.getByText("Warning")).toBeTruthy();
    expect(screen.getByText("No valid route found with the selected preferences.")).toBeTruthy();
  });
});
