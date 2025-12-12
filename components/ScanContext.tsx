'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AppState = 
  | 'idle'
  | 'uploading'
  | 'scanning'
  | 'showing-results'
  | 'error';

interface Finding {
  type: string;
  severity: 'low' | 'medium' | 'high';
  file: string;
  line: number;
  snippet: string;
}

interface Patch {
  file: string;
  change: string;
  before?: string;
  after?: string;
}

interface ScanContextType {
  appState: AppState;
  setAppState: (state: AppState) => void;
  scanResults: Finding[];
  setScanResults: (results: Finding[]) => void;
  patches: Patch[];
  setPatches: (patches: Patch[]) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>('idle');
  const [scanResults, setScanResults] = useState<Finding[]>([]);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetScan = () => {
    setAppState('idle');
    setScanResults([]);
    setPatches([]);
    setProjectId(null);
    setErrorMessage(null);
  };

  return (
    <ScanContext.Provider
      value={{
        appState,
        setAppState,
        scanResults,
        setScanResults,
        patches,
        setPatches,
        projectId,
        setProjectId,
        errorMessage,
        setErrorMessage,
        resetScan
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}