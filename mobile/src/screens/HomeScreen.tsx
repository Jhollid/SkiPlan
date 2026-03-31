import { StyleSheet, Text, View } from "react-native";

import { EmptyStateCard } from "../components/EmptyStateCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { RecentRoutesCard } from "../components/RecentRoutesCard";
import { ScreenCard } from "../components/ScreenCard";
import { RecentRoute } from "../types/api";
import { UserPreferences } from "../types/app";

type Props = {
  email: string;
  preferences: UserPreferences;
  recentRoutes: RecentRoute[];
  onStartPlanning: () => void;
  onEditPreferences: () => void;
  onSelectRecentRoute: (route: RecentRoute) => void;
};

export function HomeScreen({
  email,
  preferences,
  recentRoutes,
  onStartPlanning,
  onEditPreferences,
  onSelectRecentRoute,
}: Props) {
  const latestRoute = recentRoutes[0] ?? null;

  return (
    <View style={styles.container}>
      <ScreenCard
        title="Trip dashboard"
        subtitle="Use this workspace to review your saved profile, jump into planning, or reopen one of your recent routes."
      >
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>Ready for the mountain</Text>
          <Text style={styles.heroDescription}>
            Your route profile is saved locally, so you can get back into planning quickly.
          </Text>
        </View>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>User</Text>
            <Text style={styles.summaryValue}>{email}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Difficulty</Text>
            <Text style={styles.summaryValue}>{preferences.maxDifficulty}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Style</Text>
            <Text style={styles.summaryValue}>{preferences.routingStyle}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Recent routes</Text>
            <Text style={styles.summaryValue}>{recentRoutes.length}</Text>
          </View>
        </View>
        <View style={styles.preferencePanel}>
          <Text style={styles.preferenceLine}>
            Avoided lifts: {preferences.excludedLiftTypes.join(", ") || "none"}
          </Text>
          <Text style={styles.preferenceLine}>
            Favorite runs: {preferences.favoriteRuns.join(", ") || "none"}
          </Text>
          <Text style={styles.preferenceLine}>
            Repeat avoidance: {preferences.avoidRepeats ? "enabled" : "disabled"}
          </Text>
        </View>
        <View style={styles.actionGroup}>
          <PrimaryButton label="Start planning" onPress={onStartPlanning} />
          <PrimaryButton label="Edit preferences" onPress={onEditPreferences} variant="secondary" />
        </View>
      </ScreenCard>

      {latestRoute ? (
        <ScreenCard
          title="Last planned route"
          subtitle="Resume the most recent route setup or use it as a starting point for a new variation."
        >
          <View style={styles.latestRouteCard}>
            <Text style={styles.latestRouteTitle}>
              {latestRoute.startLabel} to {latestRoute.endLabel}
            </Text>
            <Text style={styles.preferenceLine}>{latestRoute.resortName}</Text>
            <Text style={styles.preferenceLine}>
              {latestRoute.totalSteps} steps | {latestRoute.totalLifts} lifts | {latestRoute.totalRuns} runs |{" "}
              {latestRoute.estimatedVertical}m
            </Text>
            <Text style={styles.preferenceLine}>Saved {latestRoute.createdAt}</Text>
          </View>
          <PrimaryButton label="Resume last route" onPress={() => onSelectRecentRoute(latestRoute)} />
        </ScreenCard>
      ) : null}

      {recentRoutes.length > 0 ? (
        <RecentRoutesCard routes={recentRoutes} onSelectRoute={onSelectRecentRoute} />
      ) : (
        <EmptyStateCard
          title="No recent routes yet"
          description="Your planned routes will appear here once you create one, making it easy to restart a favorite route setup."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heroBanner: {
    backgroundColor: "#E8F1FF",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  heroTitle: {
    color: "#0B3D91",
    fontWeight: "700",
    fontSize: 18,
  },
  heroDescription: {
    color: "#36506B",
    lineHeight: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryCard: {
    minWidth: "47%",
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  summaryLabel: {
    color: "#4F5D75",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  summaryValue: {
    color: "#14213D",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  preferencePanel: {
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  preferenceLine: {
    color: "#4F5D75",
  },
  actionGroup: {
    gap: 10,
  },
  latestRouteCard: {
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  latestRouteTitle: {
    color: "#14213D",
    fontWeight: "700",
    fontSize: 16,
  },
});
