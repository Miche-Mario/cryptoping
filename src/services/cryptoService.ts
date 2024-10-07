import axios from 'axios'

const API_URL = 'https://api.coingecko.com/api/v3'

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
}

const mockCryptoData: CoinData[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    current_price: 30000,
    market_cap: 582278913046,
    market_cap_rank: 1,
    price_change_percentage_24h: 1.5
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    current_price: 2000,
    market_cap: 240612837868,
    market_cap_rank: 2,
    price_change_percentage_24h: 2.1
  },
  // Add more mock data for other cryptocurrencies
]

export const getTopCryptos = async (limit: number = 10): Promise<CoinData[]> => {
  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching top cryptos:', error)
    console.warn('Using mock data due to API error')
    return mockCryptoData.slice(0, limit)
  }
}

export const getCryptoPrice = async (id: string): Promise<number | null> => {
  try {
    const response = await axios.get(`${API_URL}/simple/price`, {
      params: {
        ids: id,
        vs_currencies: 'usd'
      }
    })
    return response.data[id]?.usd || null
  } catch (error) {
    console.error('Error fetching crypto price:', error)
    console.warn('Using mock data due to API error')
    const mockCoin = mockCryptoData.find(coin => coin.id === id)
    return mockCoin ? mockCoin.current_price : null
  }
}