import * as SecureStore from "expo-secure-store";

import { RecentRoute } from "../types/api";
import { UserPreferences, UserSession } from "../types/app";

const SESSION_KEY = "ski-app/session";
const PREFERENCES_KEY = "ski-app/preferences";
const RECENT_ROUTES_KEY = "ski-app/recent-routes";

async function readJson<T>(key: string): Promise<T | null> {
  const value = await SecureStore.getItemAsync(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export function loadStoredSession(): Promise<UserSession | null> {
  return readJson<UserSession>(SESSION_KEY);
}

export function saveStoredSession(session: UserSession): Promise<void> {
  return writeJson(SESSION_KEY, session);
}

export function clearStoredSession(): Promise<void> {
  return SecureStore.deleteItemAsync(SESSION_KEY);
}

export function loadStoredPreferences(): Promise<UserPreferences | null> {
  return readJson<UserPreferences>(PREFERENCES_KEY);
}

export function saveStoredPreferences(preferences: UserPreferences): Promise<void> {
  return writeJson(PREFERENCES_KEY, preferences);
}

export function loadRecentRoutes(): Promise<RecentRoute[] | null> {
  return readJson<RecentRoute[]>(RECENT_ROUTES_KEY);
}

export function saveRecentRoutes(routes: RecentRoute[]): Promise<void> {
  return writeJson(RECENT_ROUTES_KEY, routes);
}
