import {
  createContext,
  use,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  xBullModule,
  FreighterModule,
  AlbedoModule,
} from "@creit.tech/stellar-wallets-kit";
import { UserRole } from "../interfaces/user-role";

interface WalletContextType {
  kit: StellarWalletsKit | null;
  publicKey: string;
  isConnected: boolean;
  selectedRole: UserRole | null;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  setRole: (role: UserRole) => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = use(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [kit] = useState<StellarWalletsKit>(() => {
    return new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new xBullModule(), new FreighterModule(), new AlbedoModule()],
    });
  });

  const [publicKey, setPublicKey] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const connect = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      void kit.openModal({
        onWalletSelected: (option: { id: string; name: string }) => {
          void (async () => {
            try {
              kit.setWallet(option.id);
              const { address } = await kit.getAddress();

              setPublicKey(address);
              setIsConnected(true);

              localStorage.setItem("walletAddress", address);
              localStorage.setItem("isConnected", "true");

              resolve(address);
            } catch (error) {
              console.error("Error getting address:", error);
              reject(error instanceof Error ? error : new Error(String(error)));
            }
          })();
        },
        onClosed: () => {
          reject(new Error("Modal closed without selecting wallet"));
        },
      });
    });
  }, [kit]);

  const disconnect = useCallback(async () => {
    await kit.disconnect();
    setPublicKey("");
    setIsConnected(false);
    setSelectedRole(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("selectedRole");
  }, [kit]);

  const setRole = useCallback((role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem("selectedRole", role);
  }, []);

  const signTransaction = useCallback(
    async (xdr: string): Promise<string> => {
      if (!kit || !isConnected) {
        throw new Error("Wallet not connected");
      }

      try {
        const { signedTxXdr } = await kit.signTransaction(xdr, {
          networkPassphrase: "Test SDF Network ; September 2015",
          address: publicKey,
        });
        return signedTxXdr;
      } catch (error) {
        console.error("Error signing transaction:", error);
        throw error;
      }
    },
    [kit, isConnected, publicKey],
  );

  // Restore session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedConnected = localStorage.getItem("isConnected");
    const savedRole = localStorage.getItem("selectedRole");

    if (savedAddress && savedConnected === "true") {
      setPublicKey(savedAddress);
      setIsConnected(true);
    }

    if (savedRole) {
      setSelectedRole(savedRole as UserRole);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      kit,
      publicKey,
      isConnected,
      selectedRole,
      connect,
      disconnect,
      setRole,
      signTransaction,
    }),
    [
      kit,
      publicKey,
      isConnected,
      selectedRole,
      connect,
      disconnect,
      setRole,
      signTransaction,
    ],
  );

  return <WalletContext value={contextValue}>{children}</WalletContext>;
};
