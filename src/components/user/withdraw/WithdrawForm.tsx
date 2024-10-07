import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CreditCard, DollarSign, Building, MapPin, Hash, Globe, Lock, Calendar } from 'lucide-react';

interface WithdrawFormProps {
  onSubmit: (data: any) => void;
  control: any;
  errors: any;
  watch: any;
  loading: boolean;
  balance: number;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onSubmit, control, errors, watch, loading, balance }) => {
  const withdrawMethod = watch('withdrawMethod');

  const BankFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Account Number
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="accountNumber"
            control={control}
            rules={{ required: 'Account number is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter account number"
              />
            )}
          />
        </div>
        {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>}
      </div>
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
          Account Name
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="accountName"
            control={control}
            rules={{ required: 'Account name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter account name"
              />
            )}
          />
        </div>
        {errors.accountName && <p className="mt-1 text-sm text-red-600">{errors.accountName.message}</p>}
      </div>
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
          Bank Name
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="bankName"
            control={control}
            rules={{ required: 'Bank name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter bank name"
              />
            )}
          />
        </div>
        {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>}
      </div>
      <div>
        <label htmlFor="bankAddress" className="block text-sm font-medium text-gray-700 mb-1">
          Bank Address
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="bankAddress"
            control={control}
            rules={{ required: 'Bank address is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter bank address"
              />
            )}
          />
        </div>
        {errors.bankAddress && <p className="mt-1 text-sm text-red-600">{errors.bankAddress.message}</p>}
      </div>
      <div>
        <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Routing Number
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="routingNumber"
            control={control}
            rules={{ required: 'Routing number is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter routing number"
              />
            )}
          />
        </div>
        {errors.routingNumber && <p className="mt-1 text-sm text-red-600">{errors.routingNumber.message}</p>}
      </div>
      <div>
        <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
          Swift Code
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="swiftCode"
            control={control}
            rules={{ required: 'Swift code is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter swift code"
              />
            )}
          />
        </div>
        {errors.swiftCode && <p className="mt-1 text-sm text-red-600">{errors.swiftCode.message}</p>}
      </div>
    </div>
  );

  const CardFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="cardNumber"
            control={control}
            rules={{ required: 'Card number is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter card number"
              />
            )}
          />
        </div>
        {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>}
      </div>
      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="expirationDate"
            control={control}
            rules={{ required: 'Expiration date is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="MM/YY"
              />
            )}
          />
        </div>
        {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>}
      </div>
      <div>
        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
          CVV
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="cvv"
            control={control}
            rules={{ required: 'CVV is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="CVV"
              />
            )}
          />
        </div>
        {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>}
      </div>
      <div>
        <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
          PIN
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="pin"
            control={control}
            rules={{ 
              required: 'PIN is required',
              minLength: { value: 2, message: 'PIN must be at least 2 digits' },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter PIN"
              />
            )}
          />
        </div>
        {errors.pin && <p className="mt-1 text-sm text-red-600">{errors.pin.message}</p>}
      </div>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Withdraw Amount (USD)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              min: { value: 10, message: 'Minimum withdrawal amount is $10' },
              max: { value: balance, message: 'Amount cannot exceed your balance' },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                step="0.01"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter amount"
              />
            )}
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      <div>
        <label htmlFor="withdrawMethod" className="block text-sm font-medium text-gray-700 mb-1">
          Withdraw Method
        </label>
        <Controller
          name="withdrawMethod"
          control={control}
          rules={{ required: 'Withdraw method is required' }}
          render={({ field }) => (
            <select
              {...field}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a method</option>
              <option value="bank">Bank Transfer</option>
              <option value="card">Credit Card</option>
            </select>
          )}
        />
        {errors.withdrawMethod && <p className="mt-1 text-sm text-red-600">{errors.withdrawMethod.message}</p>}
      </div>

      {withdrawMethod === 'bank' && <BankFields />}
      {withdrawMethod === 'card' && <CardFields />}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Submit Withdraw Request'}
      </button>
    </form>
  );
};

export default WithdrawForm;