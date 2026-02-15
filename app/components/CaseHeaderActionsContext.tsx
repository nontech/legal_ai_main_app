"use client";

import { createContext, useContext, useState, useCallback } from "react";

type SetHeaderActionsFn = (actions: React.ReactNode) => void;

const CaseHeaderActionsContext = createContext<{
  headerActions: React.ReactNode;
  setHeaderActions: SetHeaderActionsFn;
} | null>(null);

export function CaseHeaderActionsProvider({ children }: { children: React.ReactNode }) {
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);
  const setter = useCallback((actions: React.ReactNode) => setHeaderActions(actions), []);
  return (
    <CaseHeaderActionsContext.Provider value={{ headerActions, setHeaderActions: setter }}>
      {children}
    </CaseHeaderActionsContext.Provider>
  );
}

export function useSetHeaderActions() {
  const ctx = useContext(CaseHeaderActionsContext);
  return ctx?.setHeaderActions ?? null;
}

export function useHeaderActions() {
  const ctx = useContext(CaseHeaderActionsContext);
  return ctx?.headerActions ?? null;
}
