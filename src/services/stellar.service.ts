import { Horizon, Keypair } from "@stellar/stellar-sdk";
import {
  STELLAR_NETWORK,
  HORIZON_URL,
  STELLAR_FRIENDBOT_URL,
} from "../utils/constants.ts";
import { IKeypair } from "../interfaces/keypair.ts";

export class StellarService {
  private server: Horizon.Server;
  private network: string;
  private horizonUrl: string;
  private friendBotUrl: string;

  constructor() {
    this.network = STELLAR_NETWORK as string;
    this.horizonUrl = HORIZON_URL as string;
    this.friendBotUrl = STELLAR_FRIENDBOT_URL as string;

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
}

export const stellarService = new StellarService();
