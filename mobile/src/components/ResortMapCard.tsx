import { StyleSheet, Text, View } from "react-native";

import { MapMetadata, RoutePlan } from "../types/api";

type Props = {
  metadata: MapMetadata | null;
  routePlan: RoutePlan | null;
  startNodeLabel?: string;
  endNodeLabel?: string;
  isReusedRoute?: boolean;
};

export function ResortMapCard({
  metadata,
  routePlan,
  startNodeLabel,
  endNodeLabel,
  isReusedRoute = false,
}: Props) {
  const nextStep = routePlan?.steps[0] ?? null;
  const routeBreakdown = routePlan
    ? `${routePlan.summary.total_lifts} lifts, ${routePlan.summary.total_runs} runs`
    : "No route planned yet";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Map And Route Preview</Text>
      <Text style={styles.caption}>
        MapLibre integration is intentionally isolated behind this component while the Expo workflow is
        validated.
      </Text>

      {metadata ? (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderTitle}>{metadata.resort.name}</Text>
          <View style={styles.routeHeader}>
            <View style={styles.routeEndpoint}>
              <Text style={styles.routeLabel}>Start</Text>
              <Text style={styles.routeValue}>{startNodeLabel ?? "Select a start"}</Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeEndpoint}>
              <Text style={styles.routeLabel}>Finish</Text>
              <Text style={styles.routeValue}>{endNodeLabel ?? "Select a destination"}</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statPill}>Nodes: {metadata.nodes.length}</Text>
            <Text style={styles.statPill}>Route: {routePlan?.summary.total_steps ?? 0} steps</Text>
            <Text style={styles.statPill}>{routeBreakdown}</Text>
            {isReusedRoute ? <Text style={styles.statPill}>Reused route</Text> : null}
          </View>
          {nextStep ? (
            <View style={styles.nextStepCard}>
              <Text style={styles.routeLabel}>Next step</Text>
              <Text style={styles.nextStepTitle}>{nextStep.name}</Text>
              <Text style={styles.placeholderText}>
                {nextStep.edge_type === "lift" ? "Lift" : "Piste"} from {nextStep.from_node_key} to{" "}
                {nextStep.to_node_key}
              </Text>
            </View>
          ) : (
            <View style={styles.nextStepCard}>
              <Text style={styles.routeLabel}>Next step</Text>
              <Text style={styles.placeholderText}>
                Plan a route to preview the first lift or piste on the map.
              </Text>
            </View>
          )}
          <Text style={styles.captionSmall}>
            Bounding box: {metadata.bbox.south} to {metadata.bbox.north}. This card remains the seam where
            MapLibre overlays, step markers, and closed lift styling will be added.
          </Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>Load a resort to see map metadata.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#14213D",
  },
  caption: {
    color: "#4F5D75",
    lineHeight: 20,
  },
  mapPlaceholder: {
    minHeight: 220,
    borderRadius: 12,
    backgroundColor: "#DCEBFF",
    padding: 16,
    gap: 8,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 12,
    padding: 12,
  },
  routeEndpoint: {
    flex: 1,
    gap: 4,
  },
  routeLabel: {
    color: "#36506B",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  routeValue: {
    color: "#0B3D91",
    fontWeight: "700",
  },
  routeDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#AFC7E5",
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    backgroundColor: "rgba(255,255,255,0.65)",
    color: "#234",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
    fontSize: 12,
  },
  nextStepCard: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14213D",
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B3D91",
  },
  placeholderText: {
    color: "#234",
  },
  captionSmall: {
    color: "#36506B",
    lineHeight: 18,
    marginTop: 4,
  },
});
