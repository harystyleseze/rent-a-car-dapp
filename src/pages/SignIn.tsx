import React from "react";
import { useWallet } from "../providers/WalletProvider";
import { UserRole } from "../interfaces/user-role";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const { connect, setRole, isConnected, publicKey } = useWallet();
  const navigate = useNavigate();

  const handleRoleSelection = (role: UserRole) => {
    void (async () => {
      try {
        // Set role first
        setRole(role);

        // Connect wallet
        await connect();

        // Navigate to dashboard after successful connection
        void navigate("/dashboard");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    })();
  };

  // If already connected, redirect to dashboard using useEffect
  React.useEffect(() => {
    if (isConnected && publicKey) {
      void navigate("/dashboard");
    }
  }, [isConnected, publicKey, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Rent-a-Car DApp
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Card */}
          <div
            onClick={() => handleRoleSelection(UserRole.ADMIN)}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-white">
              <div className="text-5xl mb-4">👑</div>
              <h2 className="text-2xl font-bold mb-2">Admin</h2>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• Manage platform</li>
                <li>• Set commission rates</li>
                <li>• Withdraw earnings</li>
                <li>• Oversee operations</li>
              </ul>
            </div>
          </div>

          {/* Owner Card */}
          <div
            onClick={() => handleRoleSelection(UserRole.OWNER)}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-white">
              <div className="text-5xl mb-4">🚗</div>
              <h2 className="text-2xl font-bold mb-2">Car Owner</h2>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• List your cars</li>
                <li>• Set rental prices</li>
                <li>• Manage availability</li>
                <li>• Earn from rentals</li>
              </ul>
            </div>
          </div>

          {/* Renter Card */}
          <div
            onClick={() => handleRoleSelection(UserRole.RENTER)}
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-white">
              <div className="text-5xl mb-4">🔑</div>
              <h2 className="text-2xl font-bold mb-2">Renter</h2>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• Browse available cars</li>
                <li>• Rent vehicles</li>
                <li>• Return rentals</li>
                <li>• Pay with crypto</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Click on a role to connect your Stellar wallet and get started</p>
          <p className="mt-2">
            Don't have a wallet?{" "}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Install Freighter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
