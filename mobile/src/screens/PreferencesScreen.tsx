import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenCard } from "../components/ScreenCard";
import { SelectableChipGroup } from "../components/SelectableChipGroup";
import { SelectableMultiChipGroup } from "../components/SelectableMultiChipGroup";
import { Difficulty, RoutingStyle, UserPreferences } from "../types/app";

type Props = {
  preferences: UserPreferences;
  onChange: (preferences: UserPreferences) => void;
  onContinue: () => void;
  mode?: "onboarding" | "edit";
};

const DIFFICULTIES: Difficulty[] = ["green", "blue", "red", "black"];
const ROUTING_STYLES: RoutingStyle[] = ["fastest", "enjoyable"];
const LIFT_TYPES = ["gondola", "chair-lift", "drag-lift", "t-bar", "platter"];

export function PreferencesScreen({
  preferences,
  onChange,
  onContinue,
  mode = "onboarding",
}: Props) {
  const favoriteRunsInput = preferences.favoriteRuns.join(", ");
  const isEditMode = mode === "edit";

  function toggleLiftType(liftType: string) {
    const excludedLiftTypes = preferences.excludedLiftTypes.includes(liftType)
      ? preferences.excludedLiftTypes.filter((item) => item !== liftType)
      : [...preferences.excludedLiftTypes, liftType];

    onChange({ ...preferences, excludedLiftTypes });
  }

  function updateFavoriteRuns(value: string) {
    const favoriteRuns = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    onChange({ ...preferences, favoriteRuns });
  }

  return (
    <ScreenCard
      title={isEditMode ? "Edit route preferences" : "Onboarding preferences"}
      subtitle={
        isEditMode
          ? "Update your saved route constraints and return to the planner without restarting the flow."
          : "Capture the route constraints now so the planner logic and future backend profile stay consistent."
      }
    >
      <SelectableChipGroup
        label="Maximum difficulty"
        selectedValue={preferences.maxDifficulty}
        options={DIFFICULTIES.map((difficulty) => ({
          label: difficulty,
          value: difficulty,
        }))}
        onSelect={(maxDifficulty) =>
          onChange({ ...preferences, maxDifficulty: maxDifficulty as Difficulty })
        }
      />

      <SelectableChipGroup
        label="Routing style"
        selectedValue={preferences.routingStyle}
        options={ROUTING_STYLES.map((routingStyle) => ({
          label: routingStyle,
          value: routingStyle,
        }))}
        onSelect={(routingStyle) =>
          onChange({ ...preferences, routingStyle: routingStyle as RoutingStyle })
        }
      />

      <SelectableMultiChipGroup
        label="Lift types to avoid"
        selectedValues={preferences.excludedLiftTypes}
        options={LIFT_TYPES.map((liftType) => ({ label: liftType, value: liftType }))}
        helper="Select any lifts the route planner should exclude."
        onToggle={toggleLiftType}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Favorite runs</Text>
        <Text style={styles.helper}>
          Add comma-separated run names to help the planner favor them when they fit logically.
        </Text>
        <TextInput
          value={favoriteRunsInput}
          onChangeText={updateFavoriteRuns}
          placeholder="Blue 64, Red 10"
          style={styles.input}
        />
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

      <PrimaryButton label={isEditMode ? "Return to planner" : "Save preferences"} onPress={onContinue} />
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
  input: {
    borderWidth: 1,
    borderColor: "#D3DBE4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FBFD",
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
