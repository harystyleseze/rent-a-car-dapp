export interface AccountBalance {
  amount: string;
  assetCode: string;
}

export interface IAccount {
  publicKey: string;
  secretKey: string;
  balances?: AccountBalance[];
}
