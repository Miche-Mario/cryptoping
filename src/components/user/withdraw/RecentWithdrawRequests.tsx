import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WithdrawRequest {
  id: string;
  amount: number;
  withdrawMethod: string;
  status: string;
  date: Date;
}

interface RecentWithdrawRequestsProps {
  withdrawRequests: WithdrawRequest[];
  error: string | null;
}

const RecentWithdrawRequests: React.FC<RecentWithdrawRequestsProps> = ({ withdrawRequests, error }) => {
  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-semibold">Error:</span>
        </div>
        <p className="mt-2">{error}</p>
        <p className="mt-2 text-sm">
          Please try again later or contact support if the problem persists.
          <br />
          Error details: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Recent Withdraw Requests</h3>
      {withdrawRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${request.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.withdrawMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No recent withdraw requests.</p>
      )}
    </div>
  );
};

export default RecentWithdrawRequests;