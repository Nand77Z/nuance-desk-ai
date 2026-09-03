import { useSyncExternalStore } from "react";

export type ActivityItem = {
  id: string;
  tool: "email" | "notes" | "chat";
  label: string;
  at: number;
};

type SessionState = {
  counts: { email: number; notes: number; chat: number };
  activity: ActivityItem[];
};

let state: SessionState = {
  counts: { email: 0, notes: 0, chat: 0 },
  activity: [],
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot: SessionState = state;

export function useSession() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

export function recordActivity(tool: ActivityItem["tool"], label: string) {
  state = {
    counts: { ...state.counts, [tool]: state.counts[tool] + 1 },
    activity: [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, tool, label, at: Date.now() },
      ...state.activity,
    ].slice(0, 12),
  };
  emit();
}

export function clearSession() {
  state = { counts: { email: 0, notes: 0, chat: 0 }, activity: [] };
  emit();
}
