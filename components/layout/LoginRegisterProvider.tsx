"use client";
import { createContext, useState, useContext } from "react";

interface LoginRegisterContextType {
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  registerOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
}

const LoginRegisterContext = createContext<
  LoginRegisterContextType | undefined
>(undefined);

export const useLoginRegister = () => {
  const context = useContext(LoginRegisterContext);
  if (!context) {
    throw new Error(
      "useLoginRegister must be used within a LoginRegisterProvider"
    );
  }
  return context;
};

const LoginRegisterProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <LoginRegisterContext.Provider
      value={{ loginOpen, setLoginOpen, registerOpen, setRegisterOpen }}
    >
      {children}
    </LoginRegisterContext.Provider>
  );
};

export default LoginRegisterProvider;
