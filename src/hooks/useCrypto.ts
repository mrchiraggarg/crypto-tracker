import { useState, useEffect, useCallback } from 'react';
import { Crypto, Currency, FilterType } from '../types/crypto';
import { fetchCryptos } from '../utils/api';

export const useCrypto = (currency: Currency, autoRefresh: boolean) => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCryptos = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCryptos(currency);
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    loadCryptos();
  }, [loadCryptos]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadCryptos, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadCryptos, autoRefresh]);

  const filterCryptos = (cryptos: Crypto[], filter: FilterType, searchQuery: string): Crypto[] => {
    let filtered = [...cryptos];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        crypto =>
          crypto.name.toLowerCase().includes(query) ||
          crypto.symbol.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    switch (filter) {
      case 'gainers':
        filtered = filtered
          .filter(crypto => crypto.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'losers':
        filtered = filtered
          .filter(crypto => crypto.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
      default:
        // Keep original order (by market cap)
        break;
    }

    return filtered;
  };

  return {
    cryptos,
    loading,
    error,
    refetch: loadCryptos,
    filterCryptos
  };
};