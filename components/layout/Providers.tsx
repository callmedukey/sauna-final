"use client";

import { createContext, useContext, useState } from "react";

import ConditionsDialog from "./ConditionsDialog";
import PrivacyDialog from "./PrivacyDialog";

interface DialogContextType {
  openConditionsDialog: () => void;
  openPrivacyDialog: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const openConditionsDialog = () => {
    setIsConditionsOpen(true);
  };

  const openPrivacyDialog = () => {
    setIsPrivacyOpen(true);
  };

  return (
    <DialogContext.Provider value={{ openConditionsDialog, openPrivacyDialog }}>
      {children}
      <ConditionsDialog
        open={isConditionsOpen}
        onOpenChange={setIsConditionsOpen}
      />
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
    </DialogContext.Provider>
  );
}
