import React from 'react';
import { Crypto, Currency, FilterType } from '../types/crypto';
import { CryptoCard } from './CryptoCard';
import { Filters } from './Filters';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';

interface CryptoListProps {
  cryptos: Crypto[];
  loading: boolean;
  error: string | null;
  currency: Currency;
  darkMode: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  filteredCryptos: Crypto[];
  onRefresh: () => void;
}

export const CryptoList: React.FC<CryptoListProps> = ({
  cryptos,
  loading,
  error,
  currency,
  darkMode,
  favorites,
  onToggleFavorite,
  activeFilter,
  onFilterChange,
  searchQuery,
  filteredCryptos,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className={`w-8 h-8 animate-spin mb-4 ${
          darkMode ? 'text-blue-400' : 'text-blue-600'
        }`} />
        <p className={`text-lg ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Loading cryptocurrencies...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className={`text-lg mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {error}
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Filters
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        darkMode={darkMode}
      />

      {/* Results Info */}
      <div className={`mb-6 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {searchQuery ? (
          <p>
            Showing {filteredCryptos.length} results for "{searchQuery}"
            {activeFilter !== 'all' && ` in ${activeFilter}`}
          </p>
        ) : (
          <p>
            Showing {filteredCryptos.length} cryptocurrencies
            {activeFilter !== 'all' && ` - ${activeFilter}`}
          </p>
        )}
      </div>

      {/* Crypto Grid */}
      {filteredCryptos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className={`text-lg ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No cryptocurrencies found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              currency={currency}
              darkMode={darkMode}
              isFavorite={favorites.includes(crypto.id)}
              onToggleFavorite={() => onToggleFavorite(crypto.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};