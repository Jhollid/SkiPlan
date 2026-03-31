import { render, screen } from "@testing-library/react-native";

import { ResortMapCard } from "../components/ResortMapCard";
import { fallbackMapMetadata, fallbackRoutePlan } from "../data/mockData";


describe("ResortMapCard", () => {
  it("renders route overview details for the selected itinerary", () => {
    render(
      <ResortMapCard
        metadata={fallbackMapMetadata}
        routePlan={fallbackRoutePlan}
        startNodeLabel="Laax Base"
        endNodeLabel="Flims Village"
      />
    );

    expect(screen.getByText("Start")).toBeTruthy();
    expect(screen.getByText("Finish")).toBeTruthy();
    expect(screen.getByText("Laax Base")).toBeTruthy();
    expect(screen.getByText("Flims Village")).toBeTruthy();
    expect(screen.getByText("Next step")).toBeTruthy();
    expect(screen.getByText("Laax-Curnius Gondola")).toBeTruthy();
    expect(screen.getByText("Route: 2 steps")).toBeTruthy();
  });
});
