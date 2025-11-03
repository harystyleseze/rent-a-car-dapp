import {
  Horizon,
  Keypair,
  Networks,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { Server as RpcServer } from "@stellar/stellar-sdk/rpc";
import {
  HORIZON_URL,
  STELLAR_FRIENDBOT_URL,
  CONTRACT_ID,
} from "../utils/constants";
import { IKeypair } from "../interfaces/keypair";
import { Client as RentACarClient, networks } from "rent_a_car";

export class StellarService {
  private server: Horizon.Server;
  private horizonUrl: string;
  private friendBotUrl: string;
  private contractId: string;
  private networkPassphrase: string;

  constructor() {
    this.horizonUrl = HORIZON_URL;
    this.friendBotUrl = STELLAR_FRIENDBOT_URL;
    // Use CONTRACT_ID from env, fallback to embedded contract ID from generated client
    this.contractId = CONTRACT_ID || (networks.testnet.contractId as string);
    this.networkPassphrase = Networks.TESTNET;

    console.log("StellarService initialized with:", {
      horizonUrl: this.horizonUrl,
      contractId: this.contractId,
      contractIdFromEnv: CONTRACT_ID,
      contractIdFromClient: networks.testnet.contractId as string,
      networkPassphrase: this.networkPassphrase,
    });

    this.server = new Horizon.Server(this.horizonUrl, {
      allowHttp: true,
    });
  }

  createAccount(): IKeypair {
    const pair = Keypair.random();
    return {
      publicKey: pair.publicKey(),
      secretKey: pair.secret(),
    };
  }

  async fundAccount(publicKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.friendBotUrl}?addr=${encodeURIComponent(publicKey)}`,
      );

      if (!response.ok) {
        console.error("Failed to fund account:", response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error funding account:", error);
      return false;
    }
  }

  async getAccountBalance(publicKey: string) {
    try {
      const account = await this.server.loadAccount(publicKey);

      return account.balances.map((balance) => {
        if (balance.asset_type === "native") {
          return {
            amount: balance.balance,
            assetCode: "XLM",
          };
        } else if ("asset_code" in balance) {
          return {
            amount: balance.balance,
            assetCode: balance.asset_code,
          };
        }
        return {
          amount: balance.balance,
          assetCode: "Unknown",
        };
      });
    } catch (error) {
      console.error("Error fetching account balance:", error);
      return [];
    }
  }

  buildClient<T>(sourceAddress: string): T {
    if (!this.contractId) {
      throw new Error(
        "Contract ID is not configured. Please set VITE_CONTRACT_ID in your .env file",
      );
    }

    const client = new RentACarClient({
      contractId: this.contractId,
      networkPassphrase: this.networkPassphrase,
      rpcUrl: "https://soroban-testnet.stellar.org",
      publicKey: sourceAddress,
    });

    return client as unknown as T;
  }

  async submitTransaction(signedTxXdr: string): Promise<string | null> {
    try {
      const transaction = TransactionBuilder.fromXDR(
        signedTxXdr,
        Networks.TESTNET,
      );
      const response = await this.server.submitTransaction(transaction);
      return response.hash;
    } catch (error) {
      console.error("Error submitting transaction:", error);
      return null;
    }
  }

  async submitSorobanTransaction(signedTxXdr: string): Promise<string | null> {
    try {
      const rpcServer = new RpcServer("https://soroban-testnet.stellar.org");
      const transaction = TransactionBuilder.fromXDR(
        signedTxXdr,
        Networks.TESTNET,
      );
      const response = await rpcServer.sendTransaction(transaction);

      if (
        String(response.status) === "PENDING" ||
        String(response.status) === "DUPLICATE"
      ) {
        // Wait for the transaction to be confirmed
        let attempts = 0;
        while (attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const txResponse = await rpcServer.getTransaction(response.hash);

          if (String(txResponse.status) === "SUCCESS") {
            console.log("Transaction successful:", response.hash);
            return response.hash;
          } else if (String(txResponse.status) === "FAILED") {
            console.error("Transaction failed:", txResponse);
            throw new Error("Transaction failed");
          }
          attempts++;
        }
        // If we get here, return the hash anyway (it's still processing)
        return response.hash;
      } else if (response.status === "ERROR") {
        console.error("Transaction error:", response);
        throw new Error("Transaction submission error");
      }

      return response.hash;
    } catch (error) {
      console.error("Error submitting Soroban transaction:", error);
      throw error;
    }
  }
}

export const stellarService = new StellarService();
