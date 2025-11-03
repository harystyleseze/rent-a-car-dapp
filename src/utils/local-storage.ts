import { IAccount } from "../interfaces/account";

const STORAGE_KEYS = {
  ACCOUNTS: "stellar_accounts",
  CURRENT_ACCOUNT: "current_account",
} as const;

export const saveAccountToStorage = (name: string, account: IAccount): void => {
  const accounts = getAccountsFromStorage();
  accounts[name] = account;
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const getAccountFromStorage = (name: string): IAccount | null => {
  const accounts = getAccountsFromStorage();
  return accounts[name] || null;
};

export const getAccountsFromStorage = (): Record<string, IAccount> => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  return data ? (JSON.parse(data) as Record<string, IAccount>) : {};
};

export const saveCurrentAccount = (name: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_ACCOUNT, name);
};

export const getCurrentAccountFromStorage = (): string => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_ACCOUNT) || "";
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ACCOUNT);
};
