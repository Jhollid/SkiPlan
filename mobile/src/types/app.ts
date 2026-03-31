export type Difficulty = "green" | "blue" | "red" | "black";

export type RoutingStyle = "fastest" | "enjoyable";

export type UserPreferences = {
  maxDifficulty: Difficulty;
  excludedLiftTypes: string[];
  routingStyle: RoutingStyle;
  avoidRepeats: boolean;
  favoriteRuns: string[];
};

export type UserSession = {
  email: string;
  onboardingComplete: boolean;
};

export type AppScreen = "auth" | "home" | "preferences" | "planner";
