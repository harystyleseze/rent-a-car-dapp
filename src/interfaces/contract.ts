import type { ClientOptions } from "@stellar/stellar-sdk/contract";
import { CarStatus } from "./car-status.ts";

export interface IBaseContractClient {
  readonly options: ClientOptions;
  toXDR(): string;
}

export interface IRentACarContract extends IBaseContractClient {
  __constructor: ({
    admin,
    token,
  }: {
    admin: string;
    token: string;
  }) => Promise<this>;

  set_admin_commission: ({
    commission,
  }: {
    commission: number;
  }) => Promise<this>;
  get_admin_commission: () => Promise<number>;
  get_admin_balance: () => Promise<number>;

  add_car: ({
    owner,
    price_per_day,
  }: {
    owner: string;
    price_per_day: number;
  }) => Promise<this>;

  get_car_status: ({ owner }: { owner: string }) => Promise<CarStatus>;

  rental: ({
    renter,
    owner,
    total_days_to_rent,
  }: {
    renter: string;
    owner: string;
    total_days_to_rent: number;
  }) => Promise<this>;

  return_car: ({
    renter,
    owner,
  }: {
    renter: string;
    owner: string;
  }) => Promise<this>;

  remove_car: ({ owner }: { owner: string }) => Promise<this>;

  payout_owner: ({
    owner,
    amount,
  }: {
    owner: string;
    amount: number;
  }) => Promise<this>;

  payout_admin: ({ amount }: { amount: number }) => Promise<this>;
}
