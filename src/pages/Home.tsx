import { useEffect, useState } from "react";
import { CarsList } from "../components/CarList.tsx";
import AddCarForm from "../components/AddCarForm.tsx";
import { useStellarAccounts } from "../providers/StellarAccountProvider.tsx";
import { useWallet } from "../providers/WalletProvider.tsx";
import { ICar } from "../interfaces/car.ts";
import { CarStatus } from "../interfaces/car-status.ts";
import { UserRole } from "../interfaces/user-role.ts";

export default function Home() {
  const { cars, setCars } = useStellarAccounts();
  const { publicKey, selectedRole } = useWallet();
  const [loading, setLoading] = useState(true);

  const handleCarAdded = (newCar: ICar) => {
    setCars((prev: ICar[]) => [...prev, newCar]);
  };

  useEffect(() => {
    // Load cars from contract here
    // For now, using sample data
    const loadCars = () => {
      // TODO: Fetch cars from contract
      setLoading(false);
    };

    loadCars();
  }, [publicKey]);

  // Sample cars for demo
  const sampleCars: ICar[] = [
    {
      brand: "Tesla",
      model: "Model 3",
      color: "White",
      passengers: 5,
      ac: true,
      ownerAddress: publicKey,
      pricePerDay: 100,
      status: CarStatus.AVAILABLE,
    },
    {
      brand: "Toyota",
      model: "Camry",
      color: "Blue",
      passengers: 5,
      ac: true,
      ownerAddress: "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      pricePerDay: 50,
      status: CarStatus.AVAILABLE,
    },
    {
      brand: "Honda",
      model: "Civic",
      color: "Red",
      passengers: 4,
      ac: true,
      ownerAddress: "GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      pricePerDay: 45,
      status: CarStatus.RENTED,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {selectedRole === UserRole.OWNER
            ? "Manage Your Cars"
            : "Available Cars"}
        </h1>
        <p className="text-gray-600">
          {selectedRole === UserRole.OWNER
            ? "Add and manage your cars on the platform"
            : "Browse and interact with cars based on your role"}
        </p>
      </div>

      {selectedRole === UserRole.OWNER && (
        <AddCarForm onCarAdded={handleCarAdded} />
      )}

      <CarsList cars={cars.length > 0 ? cars : sampleCars} />
    </div>
  );
}
