import { marketGlobalSchema } from '@/data/marketGlobalSchema';
import { useGlobalMarket } from '@/hooks/useGlobalMarket';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, ChartBar, Bitcoin, Coins } from 'lucide-react';

type GlobalData = {
  activeCrypto: number;
  totalMarketCap: number;
  totalVolume: number;
  bitcoinDominance: number;
  marketCapChange: number;
};

const CryptoOverview = () => {
  const [globalData, setGlobalData] = useState<GlobalData>();
  const { data: globalMarketData, isLoading } = useGlobalMarket();

  useEffect(() => {
    if (!isLoading && globalMarketData) {
      try {
        const parsedData = marketGlobalSchema.parse(globalMarketData);
        if (!parsedData?.data) {
          console.error("No data found in globalMarketData");
          return;
        }

        const {
          total_market_cap = {},
          total_volume = {},
          active_cryptocurrencies = 0,
          market_cap_percentage = {},
          market_cap_change_percentage_24h_usd = 0,
        } = parsedData.data;

        const totalMarketCapSum = Object.values(total_market_cap).reduce(
          (sum, value) => sum + value,
          0
        );

        const totalVolumeSum = Object.values(total_volume).reduce(
          (sum, value) => sum + value,
          0
        );

        const bitcoinDominance = market_cap_percentage.btc
          ? parseFloat(market_cap_percentage.btc.toFixed(2))
          : 0;

        const formattedData: GlobalData = {
          activeCrypto: active_cryptocurrencies,
          totalMarketCap: totalMarketCapSum,
          totalVolume: totalVolumeSum,
          bitcoinDominance: bitcoinDominance,
          marketCapChange: market_cap_change_percentage_24h_usd
        };

        setGlobalData(formattedData);
      } catch (err) {
        console.error("Error parsing globalMarketData:", err);

        if (err instanceof z.ZodError) {
          console.error("Zod validation error:", JSON.stringify(err.errors, null, 2));
        }
      }
    }
  }, [globalMarketData, isLoading]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const overviewCards = [
    {
      title: "Market Cap",
      value: globalData ? formatNumber(globalData.totalMarketCap) : "0",
      change: globalData?.marketCapChange,
      icon: <ChartBar className="h-6 w-6 text-yellow-400" />,
      description: "Total cryptocurrency market capitalization"
    },
    {
      title: "24h Volume",
      value: globalData ? formatNumber(globalData.totalVolume) : "0",
      icon: <TrendingUp className="h-6 w-6 text-purple-400" />,
      description: "Total trading volume across all cryptocurrencies"
    },
    {
      title: "BTC Dominance",
      value: globalData ? `${globalData.bitcoinDominance}%` : "0%",
      icon: <Bitcoin className="h-6 w-6 text-orange-400" />,
      description: "Bitcoin's percentage of total market cap"
    },
    {
      title: "Active Cryptocurrencies",
      value: globalData ? globalData.activeCrypto.toString() : "0",
      icon: <Coins className="h-6 w-6 text-blue-400" />,
      description: "Number of active cryptocurrencies tracked"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#23242a] rounded-2xl shadow-md dark:shadow-gray-900/30 p-6 w-full transition-colors">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Market Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {isLoading
          ? Array(4).fill(0).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-600" />
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600" />
                </div>
                <Skeleton className="h-8 w-24 mb-2 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-600" />
              </div>
            ))
          : overviewCards.map((card, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-[#23242a] rounded-xl p-4 shadow-sm dark:shadow-gray-900/20 border border-gray-100 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-700 dark:text-gray-200 font-medium">{card.title}</h3>
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                    {card.icon}
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  {card.change !== undefined && (
                    <span className={`ml-2 text-sm font-medium ${
                      card.change >= 0 
                        ? 'text-green-500 dark:text-green-400' 
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {card.change >= 0 ? '+' : ''}{card.change.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{card.description}</p>
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default CryptoOverview;