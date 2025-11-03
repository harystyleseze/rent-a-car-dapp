import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CCEEACX7Y6WUEUJQ37IDBY7V2T4SLUMJG464EQZ5MUBXREEFZILNYOZG",
    }
};
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
    13: { message: "CarNotReturned" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin, token }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ admin, token }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
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
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAFVG9rZW4AAAAAAAAAAAAAAAAAAA9Db250cmFjdEJhbGFuY2UAAAAAAAAAAAAAAAAPQWRtaW5Db21taXNzaW9uAAAAAAAAAAAAAAAADEFkbWluQmFsYW5jZQAAAAEAAAAAAAAAA0NhcgAAAAABAAAAEwAAAAEAAAAAAAAABlJlbnRhbAAAAAAAAgAAABMAAAAT"]), options);
        this.options = options;
    }
    fromJSON = {
        set_admin_commission: (this.txFromJSON),
        get_admin_commission: (this.txFromJSON),
        add_car: (this.txFromJSON),
        get_car_status: (this.txFromJSON),
        rental: (this.txFromJSON),
        return_car: (this.txFromJSON),
        remove_car: (this.txFromJSON),
        payout_owner: (this.txFromJSON),
        payout_admin: (this.txFromJSON),
        get_admin_balance: (this.txFromJSON)
    };
}
