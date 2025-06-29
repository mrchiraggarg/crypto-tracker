import { Crypto, CoinDetail, ChartData, Currency } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptos = async (currency: Currency = 'usd', page: number = 1): Promise<Crypto[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=${page}&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrencies');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }
};

export const fetchCoinDetail = async (id: string, currency: Currency = 'usd'): Promise<CoinDetail> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin details');
    }
    
    const data = await response.json();
    
    // Transform the data to match our interface
    return {
      ...data,
      current_price: data.market_data.current_price[currency],
      market_cap: data.market_data.market_cap[currency],
      total_volume: data.market_data.total_volume[currency],
      high_24h: data.market_data.high_24h[currency],
      low_24h: data.market_data.low_24h[currency],
      price_change_24h: data.market_data.price_change_24h,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      market_cap_change_24h: data.market_data.market_cap_change_24h,
      market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      max_supply: data.market_data.max_supply,
      ath: data.market_data.ath[currency],
      ath_change_percentage: data.market_data.ath_change_percentage[currency],
      ath_date: data.market_data.ath_date[currency],
      atl: data.market_data.atl[currency],
      atl_change_percentage: data.market_data.atl_change_percentage[currency],
      atl_date: data.market_data.atl_date[currency],
    };
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export const fetchChartData = async (id: string, days: string, currency: Currency = 'usd'): Promise<ChartData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const searchCoins = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search coins');
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};