import { createContext, use, useCallback, useMemo, useState } from "react";
import { IAccount } from "../interfaces/account.ts";
import { ICar } from "../interfaces/car.ts";
import { UserRole } from "../interfaces/user-role.ts";
import {
  getAccountFromStorage,
  getCurrentAccountFromStorage,
  saveCurrentAccount,
} from "../utils/local-storage";

interface StellarContextType {
  currentAccount: string;
  setCurrentAccount: (name: string) => void;
  getAccount: (name: string) => IAccount | null;
  getCurrentAccountData: () => IAccount | null;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  cars: ICar[];
  setCars: (cars: ICar[] | ((prev: ICar[]) => ICar[])) => void;
  hashId: string | null;
  setHashId: (hash: string | null) => void;
}

const StellarAccountContext = createContext<StellarContextType | undefined>(
  undefined,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useStellarAccounts = () => {
  const context = use(StellarAccountContext);
  if (context === undefined) {
    throw new Error(
      "useStellarAccounts must be used within a StellarAccountProvider",
    );
  }
  return context;
};

export const StellarAccountProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentAccount, setCurrentAccountState] = useState<string>(() =>
    getCurrentAccountFromStorage(),
  );
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.RENTER);
  const [cars, setCars] = useState<ICar[]>([]);
  const [hashId, setHashId] = useState<string | null>(null);

  const setCurrentAccount = useCallback((name: string) => {
    setCurrentAccountState(name);
    saveCurrentAccount(name);
  }, []);

  const getAccount = useCallback((name: string): IAccount | null => {
    return getAccountFromStorage(name);
  }, []);

  const getCurrentAccountData = useCallback((): IAccount | null => {
    if (!currentAccount) return null;
    return getAccountFromStorage(currentAccount);
  }, [currentAccount]);

  const value: StellarContextType = useMemo(
    () => ({
      currentAccount,
      setCurrentAccount,
      getAccount,
      getCurrentAccountData,
      walletAddress,
      setWalletAddress,
      selectedRole,
      setSelectedRole,
      cars,
      setCars,
      hashId,
      setHashId,
    }),
    [
      currentAccount,
      setCurrentAccount,
      getAccount,
      getCurrentAccountData,
      walletAddress,
      selectedRole,
      cars,
      hashId,
    ],
  );

  return (
    <StellarAccountContext value={value}>{children}</StellarAccountContext>
  );
};
