import React, { useState } from 'react'
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Skeleton } from '@/components/ui/skeleton';
import { LuChevronsUpDown } from "react-icons/lu";
import Image from 'next/image';


export interface CryptoCombobox{
    value: string,
    label: string,
    icon: string,
    price: string,
    change: string
}

interface CoinComboboxProp{
    coins: CryptoCombobox[] | undefined;
    isLoading: boolean;
    isError: boolean;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const CoinCombobox = ({coins, isLoading, isError, value, setValue} : CoinComboboxProp) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  if(isLoading){
    return(
        <div className='flex flex-col gap-2'>
            <Skeleton className='h-11 w-36' />
            <Skeleton className='h-7 w-32' />
        </div>
    );
  }

  const selectedCoin = coins?.find(coin => coin.value === value);
  const filteredCoins = coins?.filter(coin =>
    coin.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded-md max-w-3xs dark:bg-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setOpen(!open)}
        >
          {selectedCoin && (
            <Image src={selectedCoin.icon} alt={selectedCoin.label} className="w-5 h-5" />
          )}
          <div className='flex items-center justify-between'>
          <span className="font-medium text-start text-gray-800 dark:text-white w-28 truncate">
            {selectedCoin ? selectedCoin.label : "Select coin"}
          </span>
          <LuChevronsUpDown className="w-4 h-4 text-gray-800 dark:text-white" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring"
        />
        <div className="max-h-60 overflow-y-auto **:mb-1">
          {filteredCoins && filteredCoins.length > 0 ? (
            filteredCoins.map(coin => (
              <button
                key={coin.value}
                className={`flex items-center w-full px-2 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${coin.value === value ? 'dark:bg-gray-700 bg-gray-200' : ''}`}
                onClick={() => {
                  setValue(coin.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Image src={coin.icon} alt={coin.label} className="w-5 h-5 mr-2" />
                <span className="text-gray-800 dark:text-white">{coin.label}</span>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">No coins found</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CoinCombobox