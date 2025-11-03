import { Layout } from "@stellar/design-system";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { useWallet } from "./providers/WalletProvider";
import { shortenAddress } from "./utils/shorten-address";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, publicKey } = useWallet();

  if (!isConnected || !publicKey) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { publicKey, selectedRole, disconnect } = useWallet();

  return (
    <main>
      <Layout.Header projectId="Rent-A-Car DApp" projectTitle="Rent-A-Car" />

      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm">
              Role: <strong className="text-blue-600">{selectedRole}</strong>
            </span>
            <span className="text-sm">
              Wallet:{" "}
              <strong className="text-gray-700">
                {shortenAddress(publicKey)}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => void disconnect()}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        </div>
      </div>

      {children}

      <Layout.Footer>
        <span>
          © {new Date().getFullYear()} Rent-A-Car DApp. Licensed under the{" "}
          <a
            href="http://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache License, Version 2.0
          </a>
          .
        </span>
      </Layout.Footer>
    </main>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
