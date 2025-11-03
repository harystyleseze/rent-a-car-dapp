import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCEEACX7Y6WUEUJQ37IDBY7V2T4SLUMJG464EQZ5MUBXREEFZILNYOZG",
  },
} as const;

export interface Car {
  available_to_withdraw: i128;
  car_status: CarStatus;
  price_per_day: i128;
}

export interface Rental {
  amount: i128;
  commission: i128;
  is_active: boolean;
  total_days_to_rent: u32;
}

export type CarStatus =
  | { tag: "Available"; values: void }
  | { tag: "Rented"; values: void }
  | { tag: "Maintenance"; values: void };

export const Errors = {
  0: { message: "ContractInitialized" },
  1: { message: "ContractNotInitialized" },
  2: { message: "CarNotFound" },
  3: { message: "AdminTokenConflict" },
  4: { message: "CarAlreadyExist" },
  6: { message: "AmountMustBePositive" },
  7: { message: "RentalNotFound" },
  8: { message: "InsufficientBalance" },
  9: { message: "BalanceNotAvailableForAmountRequested" },
  10: { message: "RentalDurationCannotBeZero" },
  11: { message: "SelfRentalNotAllowed" },
  12: { message: "CarAlreadyRented" },
  13: { message: "CarNotReturned" },
};

export type DataKey =
  | { tag: "Admin"; values: void }
  | { tag: "Token"; values: void }
  | { tag: "ContractBalance"; values: void }
  | { tag: "AdminCommission"; values: void }
  | { tag: "AdminBalance"; values: void }
  | { tag: "Car"; values: readonly [string] }
  | { tag: "Rental"; values: readonly [string, string] };

export interface Client {
  /**
   * Construct and simulate a set_admin_commission transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  set_admin_commission: (
    { commission }: { commission: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a get_admin_commission transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin_commission: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>;

  /**
   * Construct and simulate a add_car transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_car: (
    { owner, price_per_day }: { owner: string; price_per_day: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a get_car_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_car_status: (
    { owner }: { owner: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<CarStatus>>>;

  /**
   * Construct and simulate a rental transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  rental: (
    {
      renter,
      owner,
      total_days_to_rent,
    }: { renter: string; owner: string; total_days_to_rent: u32 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a return_car transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  return_car: (
    { renter, owner }: { renter: string; owner: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a remove_car transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_car: (
    { owner }: { owner: string },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a payout_owner transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  payout_owner: (
    { owner, amount }: { owner: string; amount: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a payout_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  payout_admin: (
    { amount }: { amount: i128 },
    options?: {
      /**
       * The fee to pay for the transaction. Default: BASE_FEE
       */
      fee?: number;

      /**
       * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
       */
      timeoutInSeconds?: number;

      /**
       * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
       */
      simulate?: boolean;
    },
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a get_admin_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin_balance: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>;
}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, token }: { admin: string; token: string },
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      },
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({ admin, token }, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAUc2V0X2FkbWluX2NvbW1pc3Npb24AAAABAAAAAAAAAApjb21taXNzaW9uAAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAUZ2V0X2FkbWluX2NvbW1pc3Npb24AAAAAAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAAHYWRkX2NhcgAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADXByaWNlX3Blcl9kYXkAAAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAOZ2V0X2Nhcl9zdGF0dXMAAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAPpAAAH0AAAAAlDYXJTdGF0dXMAAAAAAAAD",
        "AAAAAAAAAAAAAAAGcmVudGFsAAAAAAADAAAAAAAAAAZyZW50ZXIAAAAAABMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAASdG90YWxfZGF5c190b19yZW50AAAAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAKcmV0dXJuX2NhcgAAAAAAAgAAAAAAAAAGcmVudGVyAAAAAAATAAAAAAAAAAVvd25lcgAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAKcmVtb3ZlX2NhcgAAAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAMcGF5b3V0X293bmVyAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAMcGF5b3V0X2FkbWluAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAARZ2V0X2FkbWluX2JhbGFuY2UAAAAAAAAAAAAAAQAAAAs=",
        "AAAAAQAAAAAAAAAAAAAAA0NhcgAAAAADAAAAAAAAABVhdmFpbGFibGVfdG9fd2l0aGRyYXcAAAAAAAALAAAAAAAAAApjYXJfc3RhdHVzAAAAAAfQAAAACUNhclN0YXR1cwAAAAAAAAAAAAANcHJpY2VfcGVyX2RheQAAAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAABlJlbnRhbAAAAAAABAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApjb21taXNzaW9uAAAAAAALAAAAAAAAAAlpc19hY3RpdmUAAAAAAAABAAAAAAAAABJ0b3RhbF9kYXlzX3RvX3JlbnQAAAAAAAQ=",
        "AAAAAgAAAAAAAAAAAAAACUNhclN0YXR1cwAAAAAAAAMAAAAAAAAAAAAAAAlBdmFpbGFibGUAAAAAAAAAAAAAAAAAAAZSZW50ZWQAAAAAAAAAAAAAAAAAC01haW50ZW5hbmNlAA==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAADQAAAAAAAAATQ29udHJhY3RJbml0aWFsaXplZAAAAAAAAAAAAAAAABZDb250cmFjdE5vdEluaXRpYWxpemVkAAAAAAABAAAAAAAAAAtDYXJOb3RGb3VuZAAAAAACAAAAAAAAABJBZG1pblRva2VuQ29uZmxpY3QAAAAAAAMAAAAAAAAAD0NhckFscmVhZHlFeGlzdAAAAAAEAAAAAAAAABRBbW91bnRNdXN0QmVQb3NpdGl2ZQAAAAYAAAAAAAAADlJlbnRhbE5vdEZvdW5kAAAAAAAHAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAgAAAAAAAAAJUJhbGFuY2VOb3RBdmFpbGFibGVGb3JBbW91bnRSZXF1ZXN0ZWQAAAAAAAAJAAAAAAAAABpSZW50YWxEdXJhdGlvbkNhbm5vdEJlWmVybwAAAAAACgAAAAAAAAAUU2VsZlJlbnRhbE5vdEFsbG93ZWQAAAALAAAAAAAAABBDYXJBbHJlYWR5UmVudGVkAAAADAAAAAAAAAAOQ2FyTm90UmV0dXJuZWQAAAAAAA0=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFVG9rZW4AAAAAAAAAAAAAAAAAAA9Db250cmFjdEJhbGFuY2UAAAAAAAAAAAAAAAAPQWRtaW5Db21taXNzaW9uAAAAAAAAAAAAAAAADEFkbWluQmFsYW5jZQAAAAEAAAAAAAAAA0NhcgAAAAABAAAAEwAAAAEAAAAAAAAABlJlbnRhbAAAAAAAAgAAABMAAAAT",
      ]),
      options,
    );
  }
  public readonly fromJSON = {
    set_admin_commission: this.txFromJSON<Result<void>>,
    get_admin_commission: this.txFromJSON<i128>,
    add_car: this.txFromJSON<Result<void>>,
    get_car_status: this.txFromJSON<Result<CarStatus>>,
    rental: this.txFromJSON<Result<void>>,
    return_car: this.txFromJSON<Result<void>>,
    remove_car: this.txFromJSON<Result<void>>,
    payout_owner: this.txFromJSON<Result<void>>,
    payout_admin: this.txFromJSON<Result<void>>,
    get_admin_balance: this.txFromJSON<i128>,
  };
}
