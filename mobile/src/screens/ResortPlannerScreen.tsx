import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { API_BASE_URL, fetchMapMetadata, fetchResorts, planRoute } from "../api/client";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ResortMapCard } from "../components/ResortMapCard";
import { RouteSummaryCard } from "../components/RouteSummaryCard";
import { ScreenCard } from "../components/ScreenCard";
import { MapMetadata, ResortSummary, RoutePlan } from "../types/api";
import { UserPreferences } from "../types/app";

type Props = {
  preferences: UserPreferences;
  sessionEmail: string;
};

export function ResortPlannerScreen({ preferences, sessionEmail }: Props) {
  const [resorts, setResorts] = useState<ResortSummary[]>([]);
  const [selectedResort, setSelectedResort] = useState("flims-laax");
  const [mapMetadata, setMapMetadata] = useState<MapMetadata | null>(null);
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [startNodeKey, setStartNodeKey] = useState("laax-base");
  const [endNodeKey, setEndNodeKey] = useState("flims-village");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchResorts()
      .then(setResorts)
      .catch(() => setErrorMessage(`Unable to load resorts from ${API_BASE_URL}.`));
  }, []);

  useEffect(() => {
    fetchMapMetadata(selectedResort)
      .then((metadata) => {
        setMapMetadata(metadata);
        const availableNodeKeys = new Set(metadata.nodes.map((node) => node.node_key));
        if (!availableNodeKeys.has(startNodeKey) && metadata.nodes[0]) {
          setStartNodeKey(metadata.nodes[0].node_key);
        }
        if (!availableNodeKeys.has(endNodeKey) && metadata.nodes[1]) {
          setEndNodeKey(metadata.nodes[1].node_key);
        }
      })
      .catch(() => setErrorMessage(`Unable to load map metadata for ${selectedResort}.`));
  }, [selectedResort]);

  const resortOptions = useMemo(() => resorts.map((resort) => resort.slug).join(", "), [resorts]);
  const nodeOptions = useMemo(
    () => mapMetadata?.nodes.map((node) => node.node_key).join(", ") ?? "loading...",
    [mapMetadata]
  );

  async function handlePlanRoute() {
    const availableNodeKeys = new Set((mapMetadata?.nodes ?? []).map((node) => node.node_key));

    if (!availableNodeKeys.has(startNodeKey) || !availableNodeKeys.has(endNodeKey)) {
      setErrorMessage("Choose valid start and destination nodes from the loaded resort.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await planRoute({
        resort_slug: selectedResort,
        start_node_key: startNodeKey,
        end_node_key: endNodeKey,
        preferences: {
          max_difficulty: preferences.maxDifficulty,
          excluded_lift_types: preferences.excludedLiftTypes,
          routing_style: preferences.routingStyle,
          avoid_repeats: preferences.avoidRepeats,
          favorite_runs: preferences.favoriteRuns,
        },
      });
      setRoutePlan(result);
    } catch {
      setErrorMessage(`Unable to plan route using ${API_BASE_URL}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenCard
        title="Route Planner"
        subtitle={`Signed in as ${sessionEmail}. Planner requests use the saved onboarding preferences below.`}
      >
        <FormField label="Resort" value={selectedResort} onChangeText={setSelectedResort} helper={`Available resorts: ${resortOptions || "loading..."}`} />
        <FormField label="Start node" value={startNodeKey} onChangeText={setStartNodeKey} />
        <FormField label="Destination node" value={endNodeKey} onChangeText={setEndNodeKey} helper={`Known nodes: ${nodeOptions}`} />
        <View style={styles.preferenceSummary}>
          <Text style={styles.preferenceText}>Difficulty: {preferences.maxDifficulty}</Text>
          <Text style={styles.preferenceText}>Style: {preferences.routingStyle}</Text>
          <Text style={styles.preferenceText}>
            Repeat avoidance: {preferences.avoidRepeats ? "enabled" : "disabled"}
          </Text>
        </View>
        <PrimaryButton label="Plan route" onPress={handlePlanRoute} disabled={loading} />
        {loading ? <ActivityIndicator color="#0B3D91" /> : null}
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </ScreenCard>

      <ResortMapCard metadata={mapMetadata} routePlan={routePlan} />
      <RouteSummaryCard routePlan={routePlan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  preferenceSummary: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F4F7FB",
    gap: 4,
  },
  preferenceText: {
    color: "#4F5D75",
  },
  error: {
    color: "#A23E48",
    fontWeight: "600",
  },
});
