export const STELLAR_NETWORK =
  (import.meta.env.VITE_STELLAR_NETWORK as string) || "testnet";
export const HORIZON_URL =
  (import.meta.env.VITE_HORIZON_URL as string) ||
  "https://horizon-testnet.stellar.org";
export const STELLAR_FRIENDBOT_URL =
  (import.meta.env.VITE_FRIENDBOT_URL as string) ||
  "https://friendbot.stellar.org";
export const CONTRACT_ID = (import.meta.env.VITE_CONTRACT_ID as string) || "";
