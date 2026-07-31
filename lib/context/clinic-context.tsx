'use client';

import React, { createContext, useContext, useState } from 'react';
import { ClinicData, INITIAL_CLINICS } from '../mock-data';
import { clinicStore } from '../store';

interface ClinicContextType {
  activeClinic: ClinicData;
  clinics: ClinicData[];
  selectClinic: (id: string) => void;
  refreshClinics: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [clinics, setClinics] = useState<ClinicData[]>(() => clinicStore.getClinics());
  const [activeClinic, setActiveClinic] = useState<ClinicData>(() => clinics[0] || INITIAL_CLINICS[0]);

  const selectClinic = (id: string) => {
    const found = clinicStore.getClinicById(id);
    if (found) {
      setActiveClinic(found);
    }
  };

  const refreshClinics = () => {
    const updated = clinicStore.getClinics();
    setClinics([...updated]);
  };

  return (
    <ClinicContext.Provider value={{ activeClinic, clinics, selectClinic, refreshClinics }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within ClinicProvider');
  return context;
}
