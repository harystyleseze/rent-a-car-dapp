import { useState } from "react";
import { useWallet } from "../providers/WalletProvider.tsx";
import { useStellarAccounts } from "../providers/StellarAccountProvider.tsx";
import { stellarService } from "../services/stellar.service.ts";
import { Client as RentACarClient } from "rent_a_car";
import { ICar } from "../interfaces/car.ts";
import { CarStatus } from "../interfaces/car-status.ts";

interface AddCarFormProps {
  onCarAdded: (car: ICar) => void;
}

export default function AddCarForm({ onCarAdded }: AddCarFormProps) {
  const { publicKey: walletAddress, signTransaction } = useWallet();
  const { setHashId } = useStellarAccounts();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    color: "",
    passengers: 4,
    ac: true,
    pricePerDay: 50,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      const contractClient =
        stellarService.buildClient<RentACarClient>(walletAddress);

      // Convert price to stroops (1 XLM = 10,000,000 stroops)
      const priceInStroops = BigInt(formData.pricePerDay * 10_000_000);

      const tx = await contractClient.add_car({
        owner: walletAddress,
        price_per_day: priceInStroops,
      });

      if (!tx.built) throw new Error("Transaction not built");

      const signedXdr = await signTransaction(tx.built.toXDR());
      const txHash = await stellarService.submitSorobanTransaction(signedXdr);

      if (txHash) {
        setHashId(txHash);

        // Add the new car to the UI
        const newCar: ICar = {
          ...formData,
          ownerAddress: walletAddress,
          status: CarStatus.AVAILABLE,
        };
        onCarAdded(newCar);

        alert("Car added successfully!");

        // Reset form
        setFormData({
          brand: "",
          model: "",
          color: "",
          passengers: 4,
          ac: true,
          pricePerDay: 50,
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">
        Add Your Car to the Platform
      </h3>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand *
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Toyota"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model *
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Camry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color *
            </label>
            <input
              type="text"
              required
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., White"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers *
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.passengers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passengers: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Day (XLM) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.pricePerDay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerDay: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ac"
              checked={formData.ac}
              onChange={(e) =>
                setFormData({ ...formData, ac: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="ac"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Air Conditioning
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Adding Car..." : "Add Car to Platform"}
        </button>
      </form>
    </div>
  );
}
