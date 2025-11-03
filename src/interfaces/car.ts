import { CarStatus } from "./car-status";

export interface ICar {
  brand: string;
  model: string;
  color: string;
  passengers: number;
  ac: boolean;
  ownerAddress: string;
  pricePerDay: number;
  status: CarStatus;
  availableToWithdraw?: number;
}
