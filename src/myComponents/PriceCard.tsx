import React from 'react';
import { useAllCryptos } from '../hooks/useAllCryptos';
import { Skeleton } from '@/components/ui/skeleton';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const PriceCard = () => {
  const { data, isLoading, isError } = useAllCryptos(); // Make sure to destructure isLoading
  const top3: Crypto[] = Array.isArray(data) ? (data as Crypto[]).slice(0, 3) : [];

  // Create an array of 3 items for skeleton placeholders
  const skeletonPlaceholders = [1, 2, 3];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap gap-4 w-full">
      {isLoading ? (
        // Render skeleton loaders when data is loading
        skeletonPlaceholders.map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-xl shadow-md px-6 py-4 bg-white dark:bg-[#23242a] min-w-[250px] max-w-[330px] w-full"
          >
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex flex-col items-end min-w-[60px]">
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        ))
      ) : isError ? (
        <div className="text-red-500">Failed to load cryptocurrency data</div>
      ) : (
        // Render actual data when loaded
        top3.map((crypto) => {
          const isNegative = crypto.price_change_percentage_24h < 0;
          return (
            <div
              key={crypto.id}
              className="relative flex items-center gap-4 rounded-xl shadow-md px-6 py-4 bg-white dark:bg-[#23242a] sm:min-w-[250px] sm:max-w-[330px] w-full transition-colors border border-transparent hover:border-yellow-400"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#2d2e36]">
                <img src={crypto.image} alt={crypto.name} className="w-7 h-7 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-300 font-medium truncate">{crypto.name}</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  ₹{crypto.current_price.toLocaleString()}
                </div>
              </div>
              <div className=" flex flex-col items-end min-w-[60px]">
                <span className={`flex absolute top-4 text-sm font-semibold ${isNegative ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className={`mr-1 ${isNegative ? '' : 'rotate-180'}`}> 
                    <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PriceCard;