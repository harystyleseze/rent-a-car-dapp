import { AccountBalance } from "../interfaces/account.ts";

interface BalanceTableProps {
  balances: AccountBalance[];
}

export default function BalanceTable({ balances }: BalanceTableProps) {
  if (!balances || balances.length === 0) {
    return <div className="text-gray-500 text-sm">No balances available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {balances.map((balance) => (
            <tr key={`${balance.assetCode}-${balance.amount}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {balance.assetCode}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {parseFloat(balance.amount).toFixed(7)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
