import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartPeriod, Currency } from '../types/crypto';
import { formatPrice } from '../utils/formatters';

interface ChartProps {
  data: [number, number][];
  period: ChartPeriod;
  currency: Currency;
  darkMode: boolean;
  loading: boolean;
}

export const Chart: React.FC<ChartProps> = ({ data, period, currency, darkMode, loading }) => {
  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading chart data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No chart data available
        </div>
      </div>
    );
  }

  const chartData = data.map(([timestamp, price]) => ({
    time: timestamp,
    price: price,
    date: new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      ...(period === '365' && { year: 'numeric' }),
    }),
  }));

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (period === '1') {
      return date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (period === '7') {
      return date.toLocaleDateString(undefined, { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isPositiveTrend = data.length > 1 && data[data.length - 1][1] >= data[0][1];

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={darkMode ? '#374151' : '#E5E7EB'} 
          />
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            stroke={darkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => formatPrice(value, currency)}
            stroke={darkMode ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
              border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: darkMode ? '#F9FAFB' : '#111827',
            }}
            labelFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return date.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }}
            formatter={(value: number) => [formatPrice(value, currency), 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositiveTrend ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: isPositiveTrend ? '#10B981' : '#EF4444',
              strokeWidth: 2,
              stroke: darkMode ? '#1F2937' : '#FFFFFF'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};