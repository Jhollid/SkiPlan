import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { SectionHeader } from "../components/SectionHeader";
import { AuthScreen } from "./AuthScreen";
import { PreferencesScreen } from "./PreferencesScreen";
import { ResortPlannerScreen } from "./ResortPlannerScreen";
import { AppScreen, UserPreferences, UserSession } from "../types/app";

const DEFAULT_PREFERENCES: UserPreferences = {
  maxDifficulty: "red",
  excludedLiftTypes: [],
  routingStyle: "fastest",
  avoidRepeats: true,
  favoriteRuns: [],
};

export function MobileAppShell() {
  const [screen, setScreen] = useState<AppScreen>("auth");
  const [session, setSession] = useState<UserSession | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  const headerCopy = useMemo(() => {
    if (screen === "auth") {
      return {
        eyebrow: "Phase 1",
        title: "Account setup",
        subtitle: "Start the app with the planned email/password journey before wiring in live backend auth.",
      };
    }
    if (screen === "preferences") {
      return {
        eyebrow: "Phase 2",
        title: "Preference capture",
        subtitle: "Keep route inputs consistent by saving the skier profile separately from the route request.",
      };
    }
    return {
      eyebrow: "Phase 3",
      title: "Planner workspace",
      subtitle: "Use the saved profile to fetch a resort, choose nodes, and generate a route preview.",
    };
  }, [screen]);

  return (
    <View style={styles.container}>
      <SectionHeader
        eyebrow={headerCopy.eyebrow}
        title={headerCopy.title}
        subtitle={headerCopy.subtitle}
      />

      {screen === "auth" ? (
        <AuthScreen
          onContinue={(email) => {
            setSession({ email, onboardingComplete: false });
            setScreen("preferences");
          }}
        />
      ) : null}

      {screen === "preferences" ? (
        <PreferencesScreen
          preferences={preferences}
          onChange={setPreferences}
          onContinue={() => {
            setSession((current) =>
              current ? { ...current, onboardingComplete: true } : current
            );
            setScreen("planner");
          }}
        />
      ) : null}

      {screen === "planner" && session ? (
        <ResortPlannerScreen preferences={preferences} sessionEmail={session.email} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
});
