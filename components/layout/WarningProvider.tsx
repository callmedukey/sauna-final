"use client";
import { createContext, useState, useContext } from "react";

interface WarningContextType {
  warningOpen: boolean;
  setWarningOpen: (open: boolean) => void;
}

const WarningContext = createContext<WarningContextType | undefined>(undefined);

export const useWarning = () => {
  const context = useContext(WarningContext);
  if (!context) {
    throw new Error("useWarning must be used within a WarningProvider");
  }
  return context;
};

const WarningProvider = ({ children }: { children: React.ReactNode }) => {
  const [warningOpen, setWarningOpen] = useState(false);

  return (
    <WarningContext.Provider value={{ warningOpen, setWarningOpen }}>
      {children}
    </WarningContext.Provider>
  );
};

export default WarningProvider;
