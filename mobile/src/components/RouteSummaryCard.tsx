import { StyleSheet, Text, View } from "react-native";

import { RoutePlan } from "../types/api";

type Props = {
  routePlan: RoutePlan | null;
  startNodeLabel?: string;
  endNodeLabel?: string;
  isReusedRoute?: boolean;
};

export function RouteSummaryCard({
  routePlan,
  startNodeLabel,
  endNodeLabel,
  isReusedRoute = false,
}: Props) {
  if (!routePlan) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Route Summary</Text>
      <View style={styles.routeHeader}>
        <View style={styles.routeEndpoint}>
          <Text style={styles.routeLabel}>Start</Text>
          <Text style={styles.routeValue}>{startNodeLabel ?? "Unknown start"}</Text>
        </View>
        <View style={styles.routeDivider} />
        <View style={styles.routeEndpoint}>
          <Text style={styles.routeLabel}>Finish</Text>
          <Text style={styles.routeValue}>{endNodeLabel ?? "Unknown destination"}</Text>
        </View>
      </View>
      {isReusedRoute ? (
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            This itinerary was created from a reused recent-route setup.
          </Text>
        </View>
      ) : null}
      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Steps</Text>
          <Text style={styles.metricValue}>{routePlan.summary.total_steps}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Runs</Text>
          <Text style={styles.metricValue}>{routePlan.summary.total_runs}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Lifts</Text>
          <Text style={styles.metricValue}>{routePlan.summary.total_lifts}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Vertical</Text>
          <Text style={styles.metricValue}>{routePlan.summary.estimated_vertical}m</Text>
        </View>
      </View>
      {routePlan.summary.warnings.map((warning) => (
        <View key={warning} style={styles.warningCard}>
          <Text style={styles.warningLabel}>Warning</Text>
          <Text style={styles.warning}>{warning}</Text>
        </View>
      ))}
      {routePlan.steps.map((step) => (
        <View
          key={step.edge_key}
          style={[
            styles.stepRow,
            step.edge_type === "lift" ? styles.liftStep : styles.pisteStep,
          ]}
        >
          <View style={styles.stepNumberBadge}>
            <Text style={styles.stepNumber}>{step.step_number}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepType}>
              {step.edge_type === "lift" ? "Lift" : "Piste"}
            </Text>
            <Text style={styles.stepTitle}>{step.name}</Text>
            <Text style={styles.stepMeta}>
              {step.from_node_key} to {step.to_node_key}
            </Text>
            {step.difficulty ? (
              <Text style={styles.stepDetail}>Difficulty: {step.difficulty}</Text>
            ) : null}
            {step.lift_type ? (
              <Text style={styles.stepDetail}>Lift type: {step.lift_type}</Text>
            ) : null}
            <Text style={styles.stepDetail}>Vertical: {step.vertical_drop}m</Text>
          </View>
        </View>
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
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
  },
  routeEndpoint: {
    flex: 1,
    gap: 4,
  },
  routeLabel: {
    color: "#4F5D75",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  routeValue: {
    color: "#14213D",
    fontWeight: "700",
  },
  routeDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#D3DBE4",
  },
  infoBanner: {
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    color: "#0B3D91",
    fontWeight: "600",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    minWidth: "47%",
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  metricLabel: {
    color: "#4F5D75",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metricValue: {
    color: "#14213D",
    fontSize: 20,
    fontWeight: "700",
  },
  warningCard: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  warningLabel: {
    color: "#A23E48",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  warning: {
    color: "#7D2732",
    fontWeight: "600",
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  pisteStep: {
    backgroundColor: "#F7FBFF",
    borderWidth: 1,
    borderColor: "#D7E7F7",
  },
  liftStep: {
    backgroundColor: "#F8F6FF",
    borderWidth: 1,
    borderColor: "#E2DDF7",
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0B3D91",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepType: {
    color: "#4F5D75",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  stepTitle: {
    fontWeight: "600",
    color: "#14213D",
  },
  stepMeta: {
    color: "#4F5D75",
  },
  stepDetail: {
    color: "#36506B",
    fontSize: 12,
  },
});
