import { StyleSheet, Text, View } from "react-native";

import { MapMetadata, RoutePlan } from "../types/api";

type Props = {
  metadata: MapMetadata | null;
  routePlan: RoutePlan | null;
};

export function ResortMapCard({ metadata, routePlan }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Map Preview</Text>
      <Text style={styles.caption}>
        MapLibre integration is intentionally isolated behind this component while the Expo workflow is
        validated.
      </Text>

      {metadata ? (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.placeholderTitle}>{metadata.resort.name}</Text>
          <Text style={styles.placeholderText}>
            Nodes: {metadata.nodes.length} | Bounding box: {metadata.bbox.south} to {metadata.bbox.north}
          </Text>
          <Text style={styles.placeholderText}>
            Selected route steps: {routePlan?.summary.total_steps ?? 0}
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
    minHeight: 180,
    borderRadius: 12,
    backgroundColor: "#DCEBFF",
    padding: 16,
    justifyContent: "center",
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B3D91",
  },
  placeholderText: {
    color: "#234",
  },
});
