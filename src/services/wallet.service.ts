export interface SignTransactionResponse {
  signedTxXdr: string;
}

interface FreighterAPI {
  signTransaction: (
    xdr: string,
    options: { network: string; networkPassphrase: string },
  ) => Promise<string>;
  getPublicKey: () => Promise<string>;
  isConnected: () => Promise<boolean>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

class WalletService {
  async signTransaction(xdr: string): Promise<SignTransactionResponse> {
    try {
      if (window.freighter) {
        const signedXdr = await window.freighter.signTransaction(xdr, {
          network: "TESTNET",
          networkPassphrase: "Test SDF Network ; September 2015",
        });
        return { signedTxXdr: signedXdr };
      }

      throw new Error("No wallet extension found. Please install Freighter.");
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  }

  async connect(): Promise<string> {
    try {
      if (window.freighter) {
        const publicKey = await window.freighter.getPublicKey();
        return publicKey;
      }
      throw new Error("No wallet extension found. Please install Freighter.");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (window.freighter) {
        return await window.freighter.isConnected();
      }
      return false;
    } catch (error) {
      console.error("Wallet connection check failed:", error);
      return false;
    }
  }
}

export const walletService = new WalletService();
