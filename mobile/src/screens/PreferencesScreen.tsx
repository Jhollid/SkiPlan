import { StyleSheet, Switch, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenCard } from "../components/ScreenCard";
import { Difficulty, RoutingStyle, UserPreferences } from "../types/app";

type Props = {
  preferences: UserPreferences;
  onChange: (preferences: UserPreferences) => void;
  onContinue: () => void;
};

const DIFFICULTIES: Difficulty[] = ["green", "blue", "red", "black"];
const ROUTING_STYLES: RoutingStyle[] = ["fastest", "enjoyable"];

export function PreferencesScreen({ preferences, onChange, onContinue }: Props) {
  return (
    <ScreenCard
      title="Onboarding preferences"
      subtitle="Capture the route constraints now so the planner logic and future backend profile stay consistent."
    >
      <View style={styles.section}>
        <Text style={styles.label}>Maximum difficulty</Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((difficulty) => (
            <Text
              key={difficulty}
              style={[
                styles.chip,
                preferences.maxDifficulty === difficulty ? styles.chipSelected : null,
              ]}
              onPress={() => onChange({ ...preferences, maxDifficulty: difficulty })}
            >
              {difficulty}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Routing style</Text>
        <View style={styles.chipRow}>
          {ROUTING_STYLES.map((routingStyle) => (
            <Text
              key={routingStyle}
              style={[
                styles.chip,
                preferences.routingStyle === routingStyle ? styles.chipSelected : null,
              ]}
              onPress={() => onChange({ ...preferences, routingStyle })}
            >
              {routingStyle}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.label}>Avoid repeating runs</Text>
          <Text style={styles.helper}>Apply a penalty when the same edge appears more than once.</Text>
        </View>
        <Switch
          value={preferences.avoidRepeats}
          onValueChange={(avoidRepeats) => onChange({ ...preferences, avoidRepeats })}
        />
      </View>

      <PrimaryButton label="Save preferences" onPress={onContinue} />
    </ScreenCard>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  label: {
    fontWeight: "600",
    color: "#14213D",
  },
  helper: {
    color: "#4F5D75",
    fontSize: 12,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E8EEF5",
    color: "#234",
    overflow: "hidden",
    textTransform: "capitalize",
  },
  chipSelected: {
    backgroundColor: "#0B3D91",
    color: "#FFFFFF",
    fontWeight: "700",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  switchText: {
    flex: 1,
    gap: 4,
  },
});
