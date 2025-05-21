import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { allCryptoSchema } from "@/data/allCrypto";
import { useAllCryptos } from "@/hooks/useAllCryptos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TopCurrencies {
  name: string;
  icon: string;
  price: string;
  change: string;
  volume: string;
  marketRank: number;
  isPositive: boolean;
}

export default function MarketTable() {
  const { data: allCoinsData, isLoading, isError } = useAllCryptos();
  const [topFiveCurrencies, setTopFiveCurrencies] = useState<TopCurrencies[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        if (allCoinsData) {
          const validateSchema = allCryptoSchema.parse(allCoinsData);
          const mappedData: TopCurrencies[] = validateSchema.slice(0, 5).map((coin) => ({
            name: coin.name,
            icon: coin.image,
            price: `${coin.current_price.toLocaleString()}`,
            change: `${coin.price_change_percentage_24h}`,
            volume: `${coin.total_volume}`,
            marketRank: coin.market_cap_rank,
            isPositive: coin.price_change_percentage_24h >= 0,
          }));
          
          setTopFiveCurrencies(mappedData);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    fetchMarketData();
  }, [allCoinsData]);

  if (isError) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center bg-red-50 border-red-200 text-red-800">
        <AlertCircle size={32} className="mb-2" />
        <h3 className="text-lg font-medium">Unable to load cryptocurrency data</h3>
        <p className="text-sm opacity-80">Please try again later</p>
      </Card>
    );
  }

  return (
    <Card className="w-2/3 ml-4">
      {!isLoading && topFiveCurrencies.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">Top {topFiveCurrencies.length} cryptocurrencies</p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View all currencies
          </button>
        </div>
      )}
      <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cryptocurrency Market</h2>
            <p className="text-sm text-gray-500 mt-1">Top performing cryptocurrencies</p>
          </div>
          {!isLoading && (
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="text-sm font-medium">Live Market Data</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center font-semibold text-gray-900">#</TableHead>
              <TableHead className="font-semibold text-center pr-24 text-gray-900">Currency</TableHead>
              <TableHead className="font-semibold text-center text-gray-900">Price</TableHead>
              <TableHead className="font-semibold text-center text-gray-900">24h Change</TableHead>
              <TableHead className="font-semibold text-center text-gray-900">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`skeleton-${index}`} className="hover:bg-gray-50">
                      <TableCell>
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-left">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="text-left">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              : topFiveCurrencies.map((currency) => (
                  <TableRow 
                    key={currency.name} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <TableCell className="font-medium text-gray-700 text-center">
                      {currency.marketRank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-10 ">
                        {currency.icon ? (
                          <img
                            src={currency.icon}
                            alt={`${currency.name} logo`}
                            className="h-8 w-8 float-start rounded-full object-contain bg-white border group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">{currency.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{currency.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" font-medium text-gray-900">
                      ₹ {currency.price}
                    </TableCell>
                    <TableCell className="">
                      <div className="flex items-center justify-center gap-1">
                        {currency.isPositive ? (
                          <ArrowUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`font-medium ${
                            currency.isPositive ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {parseFloat(currency.change).toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">
                      ${parseInt(currency.volume).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      

    </Card>
  );
}