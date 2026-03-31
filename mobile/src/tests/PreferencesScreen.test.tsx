import { fireEvent, render, screen } from "@testing-library/react-native";

import { PreferencesScreen } from "../screens/PreferencesScreen";
import { UserPreferences } from "../types/app";

const basePreferences: UserPreferences = {
  maxDifficulty: "red",
  excludedLiftTypes: [],
  routingStyle: "fastest",
  avoidRepeats: true,
  favoriteRuns: [],
};

describe("PreferencesScreen", () => {
  it("updates favorite runs from comma separated text", () => {
    const onChange = jest.fn();

    render(
      <PreferencesScreen
        preferences={basePreferences}
        onChange={onChange}
        onContinue={jest.fn()}
      />
    );

    fireEvent.changeText(screen.getByPlaceholderText("Blue 64, Red 10"), "Blue 64, Red 10");

    expect(onChange).toHaveBeenCalledWith({
      ...basePreferences,
      favoriteRuns: ["Blue 64", "Red 10"],
    });
  });

  it("toggles avoided lift types", () => {
    const onChange = jest.fn();

    render(
      <PreferencesScreen
        preferences={basePreferences}
        onChange={onChange}
        onContinue={jest.fn()}
      />
    );

    fireEvent.press(screen.getByText("t-bar"));

    expect(onChange).toHaveBeenCalledWith({
      ...basePreferences,
      excludedLiftTypes: ["t-bar"],
    });
  });
});
