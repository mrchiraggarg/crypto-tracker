import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';
import { Crypto, Currency } from '../types/crypto';
import { CryptoCard } from './CryptoCard';

interface FavoritesProps {
  favorites: string[];
  cryptos: Crypto[];
  currency: Currency;
  darkMode: boolean;
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
}

export const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  cryptos,
  currency,
  darkMode,
  onToggleFavorite,
  onClearFavorites,
}) => {
  const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.id));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`p-2 rounded-lg transition-all hover:scale-105 ${
              darkMode
                ? 'bg-gray-800 text-gray-400 hover:text-white'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h1 className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Favorites
            </h1>
            <span className={`text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ({favorites.length})
            </span>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={onClearFavorites}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 ${
              darkMode
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Star className={`w-16 h-16 mx-auto mb-4 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No favorites yet
          </h2>
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Add cryptocurrencies to your favorites to see them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Cryptocurrencies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteCryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              currency={currency}
              darkMode={darkMode}
              isFavorite={true}
              onToggleFavorite={() => onToggleFavorite(crypto.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};