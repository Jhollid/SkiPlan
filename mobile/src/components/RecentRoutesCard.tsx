import { Pressable, StyleSheet, Text, View } from "react-native";

import { RecentRoute } from "../types/api";

type Props = {
  routes: RecentRoute[];
  onSelectRoute: (route: RecentRoute) => void;
};

export function RecentRoutesCard({ routes, onSelectRoute }: Props) {
  if (routes.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recent Routes</Text>
      {routes.map((route) => (
        <Pressable key={route.routeId} style={styles.routeCard} onPress={() => onSelectRoute(route)}>
          <Text style={styles.routeTitle}>
            {route.startLabel} to {route.endLabel}
          </Text>
          <Text style={styles.routeMeta}>{route.resortName}</Text>
          <Text style={styles.routeMeta}>
            {route.totalSteps} steps | {route.totalLifts} lifts | {route.totalRuns} runs |{" "}
            {route.estimatedVertical}m
          </Text>
          <Text style={styles.routeMeta}>Saved {route.createdAt}</Text>
          <Text style={styles.routeAction}>Tap to reuse this route setup</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#14213D",
  },
  routeCard: {
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  routeTitle: {
    color: "#14213D",
    fontWeight: "700",
  },
  routeMeta: {
    color: "#4F5D75",
    fontSize: 12,
  },
  routeAction: {
    color: "#0B3D91",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
});
