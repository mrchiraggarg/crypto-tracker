import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CryptoList } from './components/CryptoList';
import { CoinDetail } from './components/CoinDetail';
import { Favorites } from './components/Favorites';
import { useCrypto } from './hooks/useCrypto';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Currency, FilterType, AppState } from './types/crypto';

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('cryptoTrackerState', {
    darkMode: false,
    currency: 'usd',
    autoRefresh: true,
    favorites: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { cryptos, loading, error, refetch, filterCryptos } = useCrypto(
    appState.currency,
    appState.autoRefresh
  );

  const filteredCryptos = useMemo(() => {
    return filterCryptos(cryptos, activeFilter, searchQuery);
  }, [cryptos, activeFilter, searchQuery, filterCryptos]);

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const toggleDarkMode = () => {
    updateAppState({ darkMode: !appState.darkMode });
  };

  const setCurrency = (currency: Currency) => {
    updateAppState({ currency });
  };

  const toggleAutoRefresh = () => {
    updateAppState({ autoRefresh: !appState.autoRefresh });
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = appState.favorites.includes(id)
      ? appState.favorites.filter(fav => fav !== id)
      : [...appState.favorites, id];
    
    updateAppState({ favorites: newFavorites });
  };

  const clearFavorites = () => {
    updateAppState({ favorites: [] });
  };

  return (
    <div className={`min-h-screen transition-colors ${
      appState.darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-900'
    }`}>
      <Router>
        <Header
          darkMode={appState.darkMode}
          toggleDarkMode={toggleDarkMode}
          currency={appState.currency}
          setCurrency={setCurrency}
          autoRefresh={appState.autoRefresh}
          toggleAutoRefresh={toggleAutoRefresh}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <CryptoList
                  cryptos={cryptos}
                  filteredCryptos={filteredCryptos}
                  loading={loading}
                  error={error}
                  currency={appState.currency}
                  darkMode={appState.darkMode}
                  favorites={appState.favorites}
                  onToggleFavorite={toggleFavorite}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  searchQuery={searchQuery}
                  onRefresh={refetch}
                />
              }
            />
            <Route
              path="/coin/:id"
              element={
                <CoinDetail
                  currency={appState.currency}
                  darkMode={appState.darkMode}
                  favorites={appState.favorites}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={appState.favorites}
                  cryptos={cryptos}
                  currency={appState.currency}
                  darkMode={appState.darkMode}
                  onToggleFavorite={toggleFavorite}
                  onClearFavorites={clearFavorites}
                />
              }
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;