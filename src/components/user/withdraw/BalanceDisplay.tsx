import React from 'react';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-md">
      <p className="text-lg font-semibold">
        Current Balance: <span className="text-blue-600">${balance.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default BalanceDisplay;