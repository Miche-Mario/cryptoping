import React, { useEffect, useState } from 'react'
import { getTopCryptos, CoinData } from '../../services/cryptoService'
import { TrendingUp, TrendingDown, Loader } from 'lucide-react'

const CryptoMarketData: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const data = await getTopCryptos(10)
        setCryptoData(data)
      } catch (error) {
        console.error('Error fetching crypto data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCryptoData()
  }, [])

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Live Cryptocurrency Market Data
        </h2>
        {loading ? (
          <div className="text-center">
            <Loader className="inline-block animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-lg text-gray-600">Loading cryptocurrency data...</p>
            <LoadingSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cryptoData.map((coin) => (
                  <tr key={coin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.market_cap_rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <span className="font-medium">{coin.name}</span>
                        <span className="ml-2 text-gray-500">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${coin.current_price.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="flex items-center justify-end">
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CryptoMarketData