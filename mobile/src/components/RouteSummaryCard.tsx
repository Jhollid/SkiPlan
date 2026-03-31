import { StyleSheet, Text, View } from "react-native";

import { RoutePlan } from "../types/api";

type Props = {
  routePlan: RoutePlan | null;
};

export function RouteSummaryCard({ routePlan }: Props) {
  if (!routePlan) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Route Summary</Text>
      <Text style={styles.metric}>Steps: {routePlan.summary.total_steps}</Text>
      <Text style={styles.metric}>Runs: {routePlan.summary.total_runs}</Text>
      <Text style={styles.metric}>Lifts: {routePlan.summary.total_lifts}</Text>
      <Text style={styles.metric}>Estimated vertical: {routePlan.summary.estimated_vertical}m</Text>
      {routePlan.summary.warnings.map((warning) => (
        <Text key={warning} style={styles.warning}>
          {warning}
        </Text>
      ))}
      {routePlan.steps.map((step) => (
        <View key={step.edge_key} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{step.step_number}.</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{step.name}</Text>
            <Text style={styles.stepMeta}>
              {step.edge_type} {step.difficulty ? `| ${step.difficulty}` : ""}{" "}
              {step.lift_type ? `| ${step.lift_type}` : ""}
            </Text>
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
  metric: {
    color: "#4F5D75",
  },
  warning: {
    color: "#A23E48",
    fontWeight: "600",
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5EAF0",
  },
  stepNumber: {
    fontWeight: "700",
    color: "#0B3D91",
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontWeight: "600",
    color: "#14213D",
  },
  stepMeta: {
    color: "#4F5D75",
  },
});
