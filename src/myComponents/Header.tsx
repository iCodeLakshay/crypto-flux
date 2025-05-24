import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ModeToggle } from './dark-theme/toggle-mode'
import { FaSearch } from "react-icons/fa";
import { useAllCryptos } from '@/hooks/useAllCryptos';
import { allCryptoSchema, allCryptoTypes } from '@/data/allCrypto';
import { useAppStore } from '@/hooks/useAppStore';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Header = () => {
    const [mainSearch, setMainSearch] = useState("");
    const { data } = useAllCryptos();
    const [allCoins, setAllCoins] = useState<allCryptoTypes>([]);

    useEffect(() => {
        if (data) {
            const validateSchema = allCryptoSchema.parse(data);
            setAllCoins(validateSchema);
            // console.log("allCoins Data: ", data);
        }
    }, [data])

    return (
        <div className='poppins sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg'>
            <div className='grid flex-column grid-cols-3 items-center p-6 max-w-8xl mx-auto'>
                <div>
                    <div className='flex gap-4 items-center'>
                        <div className='relative group'>
                            <img 
                                className='w-12 h-12 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-200' 
                                src="./logo/transparent-logo-header.png" 
                                alt="logo" 
                            />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                            Crypto <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">Flux</span>
                        </h1>
                    </div>
                </div>

                <div className='relative mx-auto'>
                    <div className="relative group">
                        <Input
                            type="search"
                            value={mainSearch}
                            onChange={(e) => setMainSearch(e.target.value)}
                            placeholder="Search a coin..."
                            className="w-96 h-12 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg" 
                        />
                        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200" />
                    </div>
                    {mainSearch.length > 0 && (
                        <LiveSearch
                            allCoins={allCoins}
                            mainSearch={mainSearch}
                            setMainSearch={setMainSearch}
                        />
                    )}
                </div>
                <div>
                    <div className='flex justify-end'>
                    <ModeToggle />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LiveSearch({
    allCoins, mainSearch, setMainSearch,
}: {
    allCoins: allCryptoTypes,
    mainSearch: string,
    setMainSearch: Dispatch<SetStateAction<string>>,
}) {
    const filterCoins = allCoins.filter((coin) => coin.name.toLowerCase().includes(mainSearch.toLowerCase()));
    console.log("filterCoins: ", filterCoins);
    
    const { setOpenDialog, setSearch } = useAppStore();

    return (
        <Card className='absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto'>
            {filterCoins.length > 0 ? (
                <>
                    {filterCoins.slice(0, 5).map((coin, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSearch(coin.name);
                                setMainSearch("");
                                setOpenDialog(true);
                            }}
                            className='flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0 group'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='relative'>
                                    <Image 
                                        src={coin.image} 
                                        alt={coin.name} 
                                        width={40} 
                                        height={40} 
                                        className='rounded-full shadow-md group-hover:scale-110 transition-transform duration-200'
                                    />
                                </div>
                                <div>
                                    <span className='font-semibold text-gray-900 dark:text-gray-100 text-lg'>{coin.name}</span>
                                    <div className='text-sm text-gray-500 dark:text-gray-400 uppercase font-medium'>{coin.symbol}</div>
                                </div>
                            </div>
                            <div className='text-right'>
                                <span className='font-bold text-gray-900 dark:text-gray-100 text-lg'>
                                    {
                                        new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(coin.current_price)
                                    }
                                </span>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className='p-8 text-center'>
                    <div className='text-gray-500 dark:text-gray-400 mb-2'>
                        <FaSearch className='w-12 h-12 mx-auto mb-3 opacity-50' />
                    </div>
                    <div className='font-medium text-gray-700 dark:text-gray-300'>No Coins Found</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Try searching with a different term</div>
                </div>
            )}
            {
                filterCoins.length > 5 && (
                    <div className='p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700'>
                        <Button
                            onClick={() => {
                                setOpenDialog(true);
                                setMainSearch("");
                                setSearch(mainSearch);
                            }}
                            className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg'
                        >
                            View all coins (+{filterCoins.length - 5})
                        </Button>
                    </div>
                )
            }
        </Card>
    );
}

export default Header   