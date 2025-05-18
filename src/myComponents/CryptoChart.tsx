'use client'

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAllCryptos } from "@/hooks/useAllCryptos";
import CoinCombobox, { CryptoCombobox } from "./CoinCombobox";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import React from 'react'
import { fetchCryptoPrices } from "@/data/allCoinPrices";
import { timeStamp } from "console";

type ChartData = {
    date: string;
    price: string;
}

const CryptoChart = () => {

    const { data: cryptos, isLoading, isError } = useAllCryptos();
    const [value, setValue] = useState<string>("");
    const [formattedPrice, setFormattedPrice] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("7D");
    const [comboBoxCoins, setComboBoxCoins] = useState<CryptoCombobox[]>([]);
    const selectedCoin = comboBoxCoins?.find((coin) => coin.value === value);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (cryptos) {
            const formattedData: CryptoCombobox[] = (cryptos as unknown[])
                .map((crypto: any) => {
                    if (
                        crypto &&
                        typeof crypto === "object" &&
                        "id" in crypto &&
                        "name" in crypto &&
                        "image" in crypto &&
                        "current_price" in crypto &&
                        "price_change_percentage_24h" in crypto
                    ) {
                        return {
                            value: crypto.id,
                            label: crypto.name,
                            icon: crypto.image,
                            price: String(crypto.current_price),
                            change:
                                (crypto.price_change_percentage_24h as number).toFixed(4)[0] !== "-"
                                    ? `+${(crypto.price_change_percentage_24h as number).toFixed(4)}`
                                    : (crypto.price_change_percentage_24h as number).toFixed(4),
                        };
                    }

                    return null;
                }).filter((item): item is CryptoCombobox => item !== null);

            setComboBoxCoins(formattedData);
        }
    }, [cryptos]);

    useEffect(() => {
        if (comboBoxCoins && comboBoxCoins.length > 0 && !value) {
            setValue(comboBoxCoins[0].value);
        }
    }, [comboBoxCoins, value]);

    useEffect(() => {
        if (value) {
            if (selectedCoin) {
                const numericCoinPrice = parseFloat(selectedCoin.price);
                const formattedPrice = numericCoinPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                });
                setFormattedPrice(formattedPrice);
            }
        }
    }, [value, comboBoxCoins])

    // useEffect(() => {
    //     async function fetchPrices() {
    //         if (selectedCoin) {
    //             const data = await fetchCryptoPrices(selectedCoin?.value);
    //             const prices = (data as { price: [number, number][] }).price;
    //             const formattedPrices: ChartData[] = prices.map(
    //                 ([timeStamp, price]: [number, number]) => ({
    //                     date: new Date(timeStamp).toISOString().slice(0, 10),
    //                     price: price.toFixed(2),
    //                 })
    //             );
    //             let filteredPrices: ChartData[] = [];
    //             switch (selectedPeriod) {
    //                 case "7D": filteredPrices = formattedPrices.slice(-7); break;
    //                 case "15D": filteredPrices = formattedPrices.slice(-15); break;
    //                 case "30D": filteredPrices = formattedPrices.slice(-30); break;
    //                 default: break;
    //             }
    //             setChartData(filteredPrices);
    //         }
    //     }
    //     fetchPrices();
    // }, [value, selectedPeriod, comboBoxCoins]);

    function onChangeToggleGroup(item: string) {
        setSelectedPeriod(item);
    }

    return (
        <Card className="col-span-4 mt-5 ml-3 border-none shadow-md">
            <CardHeader className="flex flex-row item-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">
                    <CoinCombobox
                        coins={comboBoxCoins}
                        isLoading={isLoading}
                        isError={isError}
                        value={value}
                        setValue={setValue}
                    />
                    <div className="mt-4">
                        <span className="text-2xl font-bold">{formattedPrice}</span>
                        <span className={`ml-2 text-sm ${selectedCoin?.change[0] === '-' ?
                            "text-red-500" : "text-green-500"
                            }`}>{selectedCoin?.change}
                        </span>
                    </div>
                </CardTitle>
                <div className="flex gap-2">
                    <ToggleGroup
                        value={selectedPeriod}
                        onValueChange={onChangeToggleGroup}
                        type="single"
                    >
                        {["7D", "15D", "30D"].map((period, key) => (
                            <ToggleGroupItem key={key} value={`${period}`}>
                                {period}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            </CardHeader>
            <CardContent>
                        
            </CardContent>
        </Card>
    );
}

export default CryptoChart