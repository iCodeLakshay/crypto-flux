import React from 'react';
import { useAllCryptos } from '../hooks/useAllCryptos';

// Define the Crypto type based on the allCryptos structure
interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const PriceCard = () => {
  const { data } = useAllCryptos();

  // Defensive: fallback to empty array if data is not as expected
  const top3: Crypto[] = Array.isArray(data) ? (data as Crypto[]).slice(0, 3) : [];

  return (
    <div className="flex flex-row gap-4 items-center ml-3 mt-8 w-[65vw]">
      {top3.map((crypto) => {
        const isNegative = crypto.price_change_percentage_24h < 0;
        return (
          <div
            key={crypto.id}
            className="flex items-center gap-4 rounded-xl shadow-md px-6 py-4 bg-white dark:bg-[#23242a] min-w-[250px] max-w-[330px] w-full transition-colors border border-transparent hover:border-yellow-400"
          >
            {/* Icon area */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#2d2e36]">
              <img src={crypto.image} alt={crypto.name} className="w-7 h-7 object-contain" />
            </div>
            {/* Info area */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-300 font-medium truncate">{crypto.name}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                ₹{crypto.current_price.toLocaleString()}
              </div>
            </div>
            {/* Change area */}
            <div className="flex flex-col items-end min-w-[60px]">
              <span className={`flex items-center text-sm font-semibold ${isNegative ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className={`mr-1 ${isNegative ? '' : 'rotate-180'}`}> {/* Arrow */}
                  <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceCard;