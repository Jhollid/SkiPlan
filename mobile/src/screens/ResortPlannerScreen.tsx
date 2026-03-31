import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { API_BASE_URL, fetchMapMetadata, fetchResorts, planRoute } from "../api/client";
import { PrimaryButton } from "../components/PrimaryButton";
import { RecentRoutesCard } from "../components/RecentRoutesCard";
import { ResortMapCard } from "../components/ResortMapCard";
import { RouteSummaryCard } from "../components/RouteSummaryCard";
import { ScreenCard } from "../components/ScreenCard";
import { SelectableChipGroup } from "../components/SelectableChipGroup";
import { MapMetadata, RecentRoute, ResortSummary, RoutePlan } from "../types/api";
import { UserPreferences } from "../types/app";

type Props = {
  preferences: UserPreferences;
  sessionEmail: string;
  onEditPreferences: () => void;
  recentRoutes: RecentRoute[];
  onRoutePlanned: (route: RecentRoute) => void;
  onSelectRecentRoute: (route: RecentRoute) => void;
  selectedRecentRoute: RecentRoute | null;
};

export function ResortPlannerScreen({
  preferences,
  sessionEmail,
  onEditPreferences,
  recentRoutes,
  onRoutePlanned,
  onSelectRecentRoute,
  selectedRecentRoute,
}: Props) {
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
  const selectedStartNode = useMemo(
    () => mapMetadata?.nodes.find((node) => node.node_key === startNodeKey) ?? null,
    [mapMetadata, startNodeKey]
  );
  const selectedEndNode = useMemo(
    () => mapMetadata?.nodes.find((node) => node.node_key === endNodeKey) ?? null,
    [mapMetadata, endNodeKey]
  );
  const resortChipOptions = useMemo(
    () =>
      resorts.map((resort) => ({
        label: resort.name,
        value: resort.slug,
      })),
    [resorts]
  );
  const nodeChipOptions = useMemo(
    () =>
      (mapMetadata?.nodes ?? []).map((node) => ({
        label: node.name,
        value: node.node_key,
      })),
    [mapMetadata]
  );
  const isReusedRouteContext = selectedRecentRoute !== null;

  useEffect(() => {
    if (!selectedRecentRoute) {
      return;
    }

    setSelectedResort(selectedRecentRoute.resortSlug);
    setStartNodeKey(selectedRecentRoute.startNodeKey);
    setEndNodeKey(selectedRecentRoute.endNodeKey);
  }, [selectedRecentRoute]);

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
      const newRecentRoute: RecentRoute = {
        routeId: result.route_id,
        resortSlug: selectedResort,
        resortName: mapMetadata?.resort.name ?? selectedResort,
        startNodeKey: startNodeKey,
        startLabel: selectedStartNode?.name ?? startNodeKey,
        endNodeKey: endNodeKey,
        endLabel: selectedEndNode?.name ?? endNodeKey,
        totalSteps: result.summary.total_steps,
        totalLifts: result.summary.total_lifts,
        totalRuns: result.summary.total_runs,
        estimatedVertical: result.summary.estimated_vertical,
        createdAt: "just now",
      };
      onRoutePlanned(newRecentRoute);
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
        {isReusedRouteContext ? (
          <View style={styles.contextBanner}>
            <Text style={styles.contextBannerText}>
              Working from a reused route setup. Review the resort, start point, and destination before
              replanning.
            </Text>
          </View>
        ) : null}
        <SelectableChipGroup
          label="Resort"
          selectedValue={selectedResort}
          onSelect={setSelectedResort}
          options={resortChipOptions}
          helper={`Available resorts: ${resortOptions || "loading..."}`}
        />
        <SelectableChipGroup
          label="Start point"
          selectedValue={startNodeKey}
          onSelect={setStartNodeKey}
          options={nodeChipOptions}
          helper={`Known nodes: ${nodeOptions}`}
        />
        <SelectableChipGroup
          label="Destination"
          selectedValue={endNodeKey}
          onSelect={setEndNodeKey}
          options={nodeChipOptions}
        />
        <View style={styles.preferenceSummary}>
          <Text style={styles.preferenceText}>Difficulty: {preferences.maxDifficulty}</Text>
          <Text style={styles.preferenceText}>Style: {preferences.routingStyle}</Text>
          <Text style={styles.preferenceText}>
            Avoided lifts: {preferences.excludedLiftTypes.join(", ") || "none"}
          </Text>
          <Text style={styles.preferenceText}>
            Favorite runs: {preferences.favoriteRuns.join(", ") || "none"}
          </Text>
          <Text style={styles.preferenceText}>
            Repeat avoidance: {preferences.avoidRepeats ? "enabled" : "disabled"}
          </Text>
        </View>
        <PrimaryButton label="Edit preferences" onPress={onEditPreferences} variant="secondary" />
        <PrimaryButton label="Plan route" onPress={handlePlanRoute} disabled={loading} />
        {loading ? <ActivityIndicator color="#0B3D91" /> : null}
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      </ScreenCard>

      <ResortMapCard
        metadata={mapMetadata}
        routePlan={routePlan}
        startNodeLabel={selectedStartNode?.name}
        endNodeLabel={selectedEndNode?.name}
        isReusedRoute={isReusedRouteContext}
      />
      <RouteSummaryCard
        routePlan={routePlan}
        startNodeLabel={selectedStartNode?.name}
        endNodeLabel={selectedEndNode?.name}
        isReusedRoute={isReusedRouteContext}
      />
      <RecentRoutesCard routes={recentRoutes} onSelectRoute={onSelectRecentRoute} />
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
  contextBanner: {
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    padding: 12,
  },
  contextBannerText: {
    color: "#0B3D91",
    fontWeight: "600",
  },
  preferenceText: {
    color: "#4F5D75",
  },
  error: {
    color: "#A23E48",
    fontWeight: "600",
  },
});
