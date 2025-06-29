import React from 'react';
import { FilterType } from '../types/crypto';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface FiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  darkMode: boolean;
}

export const Filters: React.FC<FiltersProps> = ({ activeFilter, onFilterChange, darkMode }) => {
  const filters = [
    { key: 'all' as FilterType, label: 'All', icon: BarChart3 },
    { key: 'gainers' as FilterType, label: 'Top Gainers', icon: TrendingUp },
    { key: 'losers' as FilterType, label: 'Top Losers', icon: TrendingDown },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
            activeFilter === key
              ? 'bg-blue-600 text-white shadow-lg'
              : darkMode
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};