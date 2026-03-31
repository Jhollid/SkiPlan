import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { MobileAppShell } from "../screens/MobileAppShell";
import { UserPreferences, UserSession } from "../types/app";

jest.mock("../lib/storage", () => ({
  clearStoredSession: jest.fn(async () => undefined),
  loadRecentRoutes: jest.fn(async () => null),
  loadStoredPreferences: jest.fn(async () => null),
  loadStoredSession: jest.fn(async () => null),
  saveRecentRoutes: jest.fn(async () => undefined),
  saveStoredPreferences: jest.fn(async () => undefined),
  saveStoredSession: jest.fn(async () => undefined),
}));

jest.mock("../screens/ResortPlannerScreen", () => ({
  ResortPlannerScreen: ({
    sessionEmail,
    onEditPreferences,
    recentRoutes,
    onSelectRecentRoute,
  }: {
    sessionEmail: string;
    onEditPreferences: () => void;
    recentRoutes: Array<{ startLabel: string; endLabel: string }>;
    onSelectRecentRoute: () => void;
  }) => {
    const React = require("react");
    const { Text, View } = require("react-native");
    const { PrimaryButton } = require("../components/PrimaryButton");
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, `Planner for ${sessionEmail}`),
      React.createElement(Text, null, `Recent routes: ${recentRoutes.length}`),
      React.createElement(PrimaryButton, {
        label: "Reuse latest route",
        onPress: onSelectRecentRoute,
      }),
      React.createElement(PrimaryButton, {
        label: "Edit preferences",
        onPress: onEditPreferences,
      })
    );
  },
}));

jest.mock("../screens/HomeScreen", () => ({
  HomeScreen: ({
    email,
    recentRoutes,
    onStartPlanning,
    onEditPreferences,
  }: {
    email: string;
    recentRoutes: Array<unknown>;
    onStartPlanning: () => void;
    onEditPreferences: () => void;
  }) => {
    const React = require("react");
    const { Text, View } = require("react-native");
    const { PrimaryButton } = require("../components/PrimaryButton");
    return React.createElement(
      View,
      null,
      React.createElement(Text, null, `Home for ${email}`),
      React.createElement(Text, null, `Dashboard routes: ${recentRoutes.length}`),
      React.createElement(PrimaryButton, { label: "Start planning", onPress: onStartPlanning }),
      React.createElement(PrimaryButton, { label: "Edit preferences", onPress: onEditPreferences })
    );
  },
}));

const storage = jest.requireMock("../lib/storage") as {
  clearStoredSession: jest.Mock;
  loadRecentRoutes: jest.Mock;
  loadStoredPreferences: jest.Mock;
  loadStoredSession: jest.Mock;
  saveRecentRoutes: jest.Mock;
  saveStoredPreferences: jest.Mock;
  saveStoredSession: jest.Mock;
};

const storedPreferences: UserPreferences = {
  maxDifficulty: "blue",
  excludedLiftTypes: ["t-bar"],
  routingStyle: "enjoyable",
  avoidRepeats: false,
  favoriteRuns: ["Blue 64"],
};

const storedSession: UserSession = {
  email: "jack@example.com",
  onboardingComplete: true,
};

describe("MobileAppShell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.loadStoredSession.mockResolvedValue(null);
    storage.loadRecentRoutes.mockResolvedValue(null);
    storage.loadStoredPreferences.mockResolvedValue(null);
  });

  it("restores a saved planner session", async () => {
    storage.loadStoredSession.mockResolvedValue(storedSession);
    storage.loadStoredPreferences.mockResolvedValue(storedPreferences);

    render(<MobileAppShell />);

    expect(screen.getByText("Restoring saved state")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText("Home for jack@example.com")).toBeTruthy();
    });

    expect(screen.getByText("jack@example.com")).toBeTruthy();
  });

  it("moves from auth to preferences after a valid sign in", async () => {
    render(<MobileAppShell />);

    await waitFor(() => {
      expect(screen.getByText("Sign in or create account")).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText("jack@example.com"), "jack@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("At least 8 characters"), "password123");
    fireEvent.press(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Onboarding preferences")).toBeTruthy();
    });

    expect(storage.saveStoredSession).toHaveBeenCalledWith({
      email: "jack@example.com",
      onboardingComplete: false,
    });
  });

  it("signs out and clears the stored session", async () => {
    storage.loadStoredSession.mockResolvedValue(storedSession);

    render(<MobileAppShell />);

    await waitFor(() => {
      expect(screen.getByText("Home for jack@example.com")).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(screen.getByText("Sign out"));
    });

    await waitFor(() => {
      expect(screen.getByText("Sign in or create account")).toBeTruthy();
    });

    expect(storage.clearStoredSession).toHaveBeenCalled();
  });

  it("returns from planner to editable preferences", async () => {
    storage.loadStoredSession.mockResolvedValue(storedSession);

    render(<MobileAppShell />);

    await waitFor(() => {
      expect(screen.getByText("Home for jack@example.com")).toBeTruthy();
    });

    fireEvent.press(screen.getAllByText("Edit preferences")[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit route preferences")).toBeTruthy();
      expect(screen.getByText("Return to planner")).toBeTruthy();
    });
  });

  it("passes restored recent routes into the planner workspace", async () => {
    storage.loadStoredSession.mockResolvedValue(storedSession);
    storage.loadRecentRoutes.mockResolvedValue([
      {
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
      },
    ]);

    render(<MobileAppShell />);

    await waitFor(() => {
      expect(screen.getByText("Home for jack@example.com")).toBeTruthy();
      expect(screen.getByText("Dashboard routes: 1")).toBeTruthy();
    });
  });

  it("moves from home into the planner when planning starts", async () => {
    storage.loadStoredSession.mockResolvedValue(storedSession);

    render(<MobileAppShell />);

    await waitFor(() => {
      expect(screen.getByText("Home for jack@example.com")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Start planning"));

    await waitFor(() => {
      expect(screen.getByText("Planner for jack@example.com")).toBeTruthy();
    });
  });
});
