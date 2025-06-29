import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Github,
  Twitter,
  MessageCircle,
  Loader
} from 'lucide-react';
import { CoinDetail as CoinDetailType, ChartData, ChartPeriod, Currency } from '../types/crypto';
import { fetchCoinDetail, fetchChartData } from '../utils/api';
import { formatPrice, formatMarketCap, formatPercentage, formatSupply, formatDate } from '../utils/formatters';
import { Chart } from './Chart';

interface CoinDetailProps {
  currency: Currency;
  darkMode: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const CoinDetail: React.FC<CoinDetailProps> = ({
  currency,
  darkMode,
  favorites,
  onToggleFavorite,
}) => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('7');

  const isFavorite = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (!id) return;

    const loadCoinData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [coinData, chartData] = await Promise.all([
          fetchCoinDetail(id, currency),
          fetchChartData(id, chartPeriod, currency),
        ]);
        setCoin(coinData);
        setChartData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coin data');
      } finally {
        setLoading(false);
      }
    };

    loadCoinData();
  }, [id, currency]);

  useEffect(() => {
    if (!id) return;

    const loadChartData = async () => {
      try {
        setChartLoading(true);
        const data = await fetchChartData(id, chartPeriod, currency);
        setChartData(data);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      } finally {
        setChartLoading(false);
      }
    };

    loadChartData();
  }, [id, chartPeriod, currency]);

  const chartPeriods = [
    { key: '1' as ChartPeriod, label: '24H' },
    { key: '7' as ChartPeriod, label: '7D' },
    { key: '30' as ChartPeriod, label: '30D' },
    { key: '365' as ChartPeriod, label: '1Y' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <Loader className={`w-8 h-8 animate-spin ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {error || 'Coin not found'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
        
        <div className="flex items-center gap-4 flex-1">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {coin.name}
            </h1>
            <p className={`text-lg uppercase font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {coin.symbol}
            </p>
          </div>
        </div>

        <button
          onClick={() => id && onToggleFavorite(id)}
          className={`p-3 rounded-lg transition-all hover:scale-110 ${
            isFavorite
              ? 'text-yellow-500 hover:text-yellow-600'
              : darkMode
              ? 'text-gray-600 hover:text-gray-400'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Price Section */}
      <div className={`rounded-2xl p-6 mb-8 ${
        darkMode
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
          : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className={`text-4xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {formatPrice(coin.current_price, currency)}
            </div>
            <div className={`flex items-center gap-2 text-lg font-medium ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              {formatPercentage(coin.price_change_percentage_24h)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Market Cap Rank
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                #{coin.market_cap_rank}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Market Cap
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatMarketCap(coin.market_cap, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Volume (24h)
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatMarketCap(coin.total_volume, currency)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Circulating Supply
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatSupply(coin.circulating_supply)} {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Supply
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {coin.total_supply ? formatSupply(coin.total_supply) : 'N/A'} {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All-Time High
              </span>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatPrice(coin.ath, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className={`rounded-2xl p-6 mb-8 ${
        darkMode
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
          : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Price Chart
          </h2>
          <div className="flex gap-2">
            {chartPeriods.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setChartPeriod(key)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  chartPeriod === key
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <Chart
          data={chartData?.prices || []}
          period={chartPeriod}
          currency={currency}
          darkMode={darkMode}
          loading={chartLoading}
        />
      </div>

      {/* Links Section */}
      {coin.links && (
        <div className={`rounded-2xl p-6 ${
          darkMode
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
            : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Links & Resources
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coin.links.homepage[0] && (
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                Website
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
            
            {coin.links.repos_url.github[0] && (
              <a
                href={coin.links.repos_url.github[0]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
            
            {coin.links.twitter_screen_name && (
              <a
                href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Twitter className="w-4 h-4" />
                Twitter
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
            
            {coin.links.subreddit_url && (
              <a
                href={coin.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Reddit
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};