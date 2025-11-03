import { useState } from "react";
import { ICar } from "../interfaces/car.ts";
import { CarStatus } from "../interfaces/car-status.ts";
import { UserRole } from "../interfaces/user-role.ts";
import { useStellarAccounts } from "../providers/StellarAccountProvider.tsx";
import { useWallet } from "../providers/WalletProvider.tsx";
import { stellarService } from "../services/stellar.service.ts";
import { shortenAddress } from "../utils/shorten-address.ts";
import { ONE_XLM_IN_STROOPS } from "../utils/xlm-in-stroops.ts";
import { Client as RentACarClient } from "rent_a_car";

interface CarsListProps {
  cars: ICar[];
}

export const CarsList = ({ cars: initialCars }: CarsListProps) => {
  const { setHashId, setCars: setContextCars } = useStellarAccounts();
  const {
    publicKey: walletAddress,
    selectedRole,
    signTransaction,
  } = useWallet();
  const [cars, setCarsLocal] = useState<ICar[]>(initialCars);

  const setCars = (update: ICar[] | ((prev: ICar[]) => ICar[])) => {
    const newCars = typeof update === "function" ? update(cars) : update;
    setCarsLocal(newCars);
    setContextCars(newCars);
  };
  const [adminCommission, setAdminCommission] = useState<number>(0);

  const handleSetCommission = async (commission: number) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.set_admin_commission({
        commission: BigInt(commission),
      });

      // Get built transaction and sign it
      if (!tx.built) throw new Error("Transaction not built");
      const signedXdr = await signTransaction(tx.built.toXDR());

      // Submit to Soroban RPC
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setHashId(txHash);
        alert("Commission set successfully!");
      }
    } catch (error) {
      console.error("Error setting commission:", error);
      alert("Failed to set commission: " + (error as Error).message);
    }
  };

  const handleDelete = async (owner: string) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.remove_car({ owner });
      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setCars((prev: ICar[]) =>
          prev.filter((car: ICar) => car.ownerAddress !== owner),
        );
        setHashId(txHash);
        alert("Car removed successfully!");
      }
    } catch (error) {
      console.error("Error removing car:", error);
      alert("Failed to remove car: " + (error as Error).message);
    }
  };

  const handlePayoutOwner = async (owner: string, amount: number) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.payout_owner({
        owner,
        amount: BigInt(amount),
      });
      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setHashId(txHash);
        alert("Payout successful!");
      }
    } catch (error) {
      console.error("Error with payout:", error);
      alert("Failed to payout: " + (error as Error).message);
    }
  };

  const handlePayoutAdmin = async (amount: number) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.payout_admin({ amount: BigInt(amount) });
      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setHashId(txHash);
        alert("Admin payout successful!");
      }
    } catch (error) {
      console.error("Error with admin payout:", error);
      alert("Failed to payout admin: " + (error as Error).message);
    }
  };

  const handleRent = async (car: ICar, totalDaysToRent: number) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.rental({
        renter: walletAddress,
        owner: car.ownerAddress,
        total_days_to_rent: totalDaysToRent,
      });
      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setCars((prev: ICar[]) =>
          prev.map((c: ICar) =>
            c.ownerAddress === car.ownerAddress
              ? { ...c, status: CarStatus.RENTED }
              : c,
          ),
        );
        setHashId(txHash);
        alert("Car rented successfully!");
      }
    } catch (error) {
      console.error("Error renting car:", error);
      alert("Failed to rent car: " + (error as Error).message);
    }
  };

  const handleReturn = async (car: ICar) => {
    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      const tx = await contractClient.return_car({
        renter: walletAddress,
        owner: car.ownerAddress,
      });
      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setCars((prev: ICar[]) =>
          prev.map((c: ICar) =>
            c.ownerAddress === car.ownerAddress
              ? { ...c, status: CarStatus.AVAILABLE }
              : c,
          ),
        );
        setHashId(txHash);
        alert("Car returned successfully!");
      }
    } catch (error) {
      console.error("Error returning car:", error);
      alert("Failed to return car: " + (error as Error).message);
    }
  };

  const getStatusStyle = (status: CarStatus) => {
    switch (status) {
      case CarStatus.AVAILABLE:
        return "px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800";
      case CarStatus.RENTED:
        return "px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800";
      case CarStatus.MAINTENANCE:
        return "px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
      default:
        return "px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
    }
  };

  const renderActionButton = (car: ICar) => {
    if (selectedRole === UserRole.ADMIN) {
      return (
        <button
          type="button"
          onClick={() => void handleDelete(car.ownerAddress)}
          className="px-3 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors cursor-pointer"
        >
          Delete
        </button>
      );
    }

    if (selectedRole === UserRole.OWNER) {
      const canWithdraw = car.status === CarStatus.AVAILABLE;
      const amount = car.pricePerDay * 3 * ONE_XLM_IN_STROOPS;

      return (
        <button
          type="button"
          onClick={() => void handlePayoutOwner(car.ownerAddress, amount)}
          disabled={!canWithdraw}
          className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
            canWithdraw
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {canWithdraw ? "Withdraw" : "Car Rented"}
        </button>
      );
    }

    if (selectedRole === UserRole.RENTER) {
      if (car.status === CarStatus.AVAILABLE) {
        return (
          <button
            type="button"
            onClick={() => void handleRent(car, 3)}
            className="px-3 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Rent
          </button>
        );
      } else if (car.status === CarStatus.RENTED) {
        return (
          <button
            type="button"
            onClick={() => void handleReturn(car)}
            className="px-3 py-1 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Return
          </button>
        );
      }
    }

    return null;
  };

  return (
    <div data-test="cars-list">
      {selectedRole === UserRole.ADMIN && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Admin Controls</h3>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={adminCommission}
                onChange={(e) => setAdminCommission(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSetCommission(adminCommission)}
              className="px-4 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors cursor-pointer mt-4"
            >
              Set Commission
            </button>
            <button
              type="button"
              onClick={() => void handlePayoutAdmin(100 * ONE_XLM_IN_STROOPS)}
              className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors cursor-pointer mt-4"
            >
              Withdraw Commission
            </button>
          </div>
        </div>
      )}

      <div>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passengers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                A/C
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cars.map((car) => (
              <tr
                key={`${car.ownerAddress}-${car.brand}-${car.model}`}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {car.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {car.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {car.color}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {car.passengers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {car.ac ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shortenAddress(car.ownerAddress)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${car.pricePerDay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={getStatusStyle(car.status)}>
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderActionButton(car)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
