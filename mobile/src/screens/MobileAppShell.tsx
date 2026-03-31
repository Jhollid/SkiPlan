import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { RecentRoute } from "../types/api";
import { SectionHeader } from "../components/SectionHeader";
import {
  clearStoredSession,
  loadRecentRoutes,
  loadStoredPreferences,
  loadStoredSession,
  saveRecentRoutes,
  saveStoredPreferences,
  saveStoredSession,
} from "../lib/storage";
import { AuthScreen } from "./AuthScreen";
import { HomeScreen } from "./HomeScreen";
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
  const [recentRoutes, setRecentRoutes] = useState<RecentRoute[]>([]);
  const [selectedRecentRoute, setSelectedRecentRoute] = useState<RecentRoute | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [storedSession, storedPreferences, storedRecentRoutes] = await Promise.all([
          loadStoredSession(),
          loadStoredPreferences(),
          loadRecentRoutes(),
        ]);

        if (storedPreferences) {
          setPreferences(storedPreferences);
        }
        if (storedRecentRoutes) {
          setRecentRoutes(storedRecentRoutes);
        }

        if (storedSession) {
          setSession(storedSession);
          setScreen(storedSession.onboardingComplete ? "home" : "preferences");
        }
      } catch {
        setErrorMessage("Unable to restore saved app state.");
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    saveStoredPreferences(preferences).catch(() => {
      setErrorMessage("Unable to save preferences locally.");
    });
  }, [isBootstrapping, preferences]);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    saveRecentRoutes(recentRoutes).catch(() => {
      setErrorMessage("Unable to save recent routes locally.");
    });
  }, [isBootstrapping, recentRoutes]);

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
    if (screen === "home") {
      return {
        eyebrow: "Home",
        title: "Trip dashboard",
        subtitle: "Review your skier profile, revisit recent routes, or jump straight back into planning.",
      };
    }
    return {
      eyebrow: "Phase 3",
      title: "Planner workspace",
      subtitle: "Use the saved profile to fetch a resort, choose nodes, and generate a route preview.",
    };
  }, [screen]);

  async function handleSignedIn(email: string) {
    const nextSession = { email, onboardingComplete: false };
    setErrorMessage(null);
    setSession(nextSession);
    setScreen("preferences");
    try {
      await saveStoredSession(nextSession);
    } catch {
      setErrorMessage("Unable to save your session locally.");
    }
  }

  async function handlePreferencesSaved() {
    if (!session) {
      return;
    }

    const nextSession = { ...session, onboardingComplete: true };
    setErrorMessage(null);
    setSession(nextSession);
    setScreen("home");
    try {
      await Promise.all([saveStoredSession(nextSession), saveStoredPreferences(preferences)]);
    } catch {
      setErrorMessage("Preferences were applied, but local persistence failed.");
    }
  }

  function handleEditPreferences() {
    setErrorMessage(null);
    setScreen("preferences");
  }

  async function handleSignOut() {
    setErrorMessage(null);
    setSession(null);
    setScreen("auth");
    try {
      await clearStoredSession();
    } catch {
      setErrorMessage("Signed out locally, but the saved session could not be cleared.");
    }
  }

  function handleRoutePlanned(route: RecentRoute) {
    setSelectedRecentRoute(route);
    setRecentRoutes((current) => {
      const nextRoutes = [route, ...current.filter((item) => item.routeId !== route.routeId)];
      return nextRoutes.slice(0, 5);
    });
  }

  function handleSelectRecentRoute(route: RecentRoute) {
    setErrorMessage(null);
    setSelectedRecentRoute(route);
    setScreen("planner");
    setRecentRoutes((current) => [route, ...current.filter((item) => item.routeId !== route.routeId)]);
  }

  if (isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <SectionHeader
          eyebrow="Loading"
          title="Restoring saved state"
          subtitle="Checking the locally stored session and route preferences."
        />
        <ActivityIndicator color="#0B3D91" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader
        eyebrow={headerCopy.eyebrow}
        title={headerCopy.title}
        subtitle={headerCopy.subtitle}
      />

      {session ? (
        <View style={styles.sessionBar}>
          <Text style={styles.sessionText}>{session.email}</Text>
          <PrimaryButton label="Sign out" onPress={handleSignOut} />
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {screen === "auth" ? (
        <AuthScreen onContinue={handleSignedIn} />
      ) : null}

      {screen === "preferences" ? (
        <PreferencesScreen
          preferences={preferences}
          onChange={setPreferences}
          onContinue={handlePreferencesSaved}
          mode={session?.onboardingComplete ? "edit" : "onboarding"}
        />
      ) : null}

      {screen === "home" && session ? (
        <HomeScreen
          email={session.email}
          preferences={preferences}
          recentRoutes={recentRoutes}
          onStartPlanning={() => setScreen("planner")}
          onEditPreferences={handleEditPreferences}
          onSelectRecentRoute={handleSelectRecentRoute}
        />
      ) : null}

      {screen === "planner" && session ? (
        <ResortPlannerScreen
          preferences={preferences}
          sessionEmail={session.email}
          onEditPreferences={handleEditPreferences}
          recentRoutes={recentRoutes}
          onRoutePlanned={handleRoutePlanned}
          onSelectRecentRoute={handleSelectRecentRoute}
          selectedRecentRoute={selectedRecentRoute}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  loadingContainer: {
    gap: 18,
  },
  sessionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  sessionText: {
    flex: 1,
    color: "#4F5D75",
    fontWeight: "600",
  },
  error: {
    color: "#A23E48",
    fontWeight: "600",
  },
});
