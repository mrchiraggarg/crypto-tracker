import { Currency } from '../types/crypto';

export const formatPrice = (price: number, currency: Currency): string => {
  const currencySymbols = {
    usd: '$',
    eur: '€',
    inr: '₹'
  };
  
  const symbol = currencySymbols[currency];
  
  if (price < 0.01) {
    return `${symbol}${price.toFixed(6)}`;
  } else if (price < 1) {
    return `${symbol}${price.toFixed(4)}`;
  } else if (price < 100) {
    return `${symbol}${price.toFixed(2)}`;
  } else {
    return `${symbol}${price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
};

export const formatMarketCap = (marketCap: number, currency: Currency): string => {
  const currencySymbols = {
    usd: '$',
    eur: '€',
    inr: '₹'
  };
  
  const symbol = currencySymbols[currency];
  
  if (marketCap >= 1e12) {
    return `${symbol}${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `${symbol}${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `${symbol}${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `${symbol}${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return `${symbol}${marketCap.toFixed(2)}`;
  }
};

export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

export const formatSupply = (supply: number): string => {
  if (supply >= 1e12) {
    return `${(supply / 1e12).toFixed(2)}T`;
  } else if (supply >= 1e9) {
    return `${(supply / 1e9).toFixed(2)}B`;
  } else if (supply >= 1e6) {
    return `${(supply / 1e6).toFixed(2)}M`;
  } else if (supply >= 1e3) {
    return `${(supply / 1e3).toFixed(2)}K`;
  } else {
    return supply.toLocaleString();
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};