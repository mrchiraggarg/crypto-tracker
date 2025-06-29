import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Zap, ZapOff, TrendingUp, Star, Settings } from 'lucide-react';
import { Currency } from '../types/crypto';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  autoRefresh: boolean;
  toggleAutoRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  currency,
  setCurrency,
  autoRefresh,
  toggleAutoRefresh,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  const currencies = [
    { value: 'usd' as Currency, label: 'USD', symbol: '$' },
    { value: 'eur' as Currency, label: 'EUR', symbol: '€' },
    { value: 'inr' as Currency, label: 'INR', symbol: '₹' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
      darkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            <TrendingUp className="w-6 h-6 text-blue-600" />
            CryptoTracker
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.label}
                </option>
              ))}
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={toggleAutoRefresh}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                autoRefresh
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : darkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              {autoRefresh ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="View favorites"
            >
              <Star className="w-4 h-4" />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};