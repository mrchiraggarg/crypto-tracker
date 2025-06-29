import React from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Crypto, Currency } from '../types/crypto';
import { formatPrice, formatMarketCap, formatPercentage } from '../utils/formatters';

interface CryptoCardProps {
  crypto: Crypto;
  currency: Currency;
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  currency,
  darkMode,
  isFavorite,
  onToggleFavorite,
}) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div className={`relative group rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      darkMode
        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/70'
        : 'bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 shadow-sm'
    }`}>
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all hover:scale-110 ${
          isFavorite
            ? 'text-yellow-500 hover:text-yellow-600'
            : darkMode
            ? 'text-gray-600 hover:text-gray-400'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/coin/${crypto.id}`} className="block">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={crypto.image}
            alt={crypto.name}
            className="w-10 h-10 rounded-full"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg truncate ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {crypto.name}
            </h3>
            <p className={`text-sm uppercase font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {crypto.symbol}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              #{crypto.market_cap_rank}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className={`text-2xl font-bold mb-1 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {formatPrice(crypto.current_price, currency)}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {formatPercentage(crypto.price_change_percentage_24h)}
          </div>
        </div>

        {/* Market Cap */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Market Cap
            </span>
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {formatMarketCap(crypto.market_cap, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Volume (24h)
            </span>
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {formatMarketCap(crypto.total_volume, currency)}
            </span>
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          darkMode
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
        }`} />
      </Link>
    </div>
  );
};