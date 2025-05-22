'use client'

import React from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAllCryptos } from "@/hooks/useAllCryptos";
import CoinCombobox, { CryptoCombobox } from "./CoinCombobox";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { fetchCryptoPrices } from "@/data/allCoinPrices";
import { Skeleton } from "@/components/ui/skeleton";

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
    const [chartLoading, setChartLoading] = useState(false);
    const [chartError, setChartError] = useState<string | null>(null);

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
        if (!value && comboBoxCoins.length > 0) {
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
    }, [value, comboBoxCoins]);

useEffect(() => {
    async function fetchPrices() {
        if (selectedCoin) {
            const data = await fetchCryptoPrices(selectedCoin?.value);
            const prices = (data as [number, number][]);

            const formattedPrices: ChartData[] = prices.map(
                ([timestamp, price]) => ({
                    date: new Date(timestamp).toISOString().slice(0, 10),
                    price: price.toFixed(2),
                })
            );

            let filteredPrices: ChartData[] = [];
            switch (selectedPeriod) {
                case "7D": filteredPrices = formattedPrices.slice(-7); break;
                case "15D": filteredPrices = formattedPrices.slice(-15); break;
                case "30D": filteredPrices = formattedPrices.slice(-30); break;
                default: break;
            }

            setChartData(filteredPrices);
        }
    }
    fetchPrices();
}, [selectedCoin, selectedPeriod]);

    function onChangeToggleGroup(item: string) {
        setSelectedPeriod(item);
    }

    return (
        <Card className="h-full col-span-4 ml-3 border-none shadow-md">
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
                {isLoading || chartLoading ? (
                    <div className="h-[300px]">
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                ) : chartError ? (
                    <div className="h-[300px] flex items-center justify-center text-red-500">
                        {chartError}
                    </div>
                ) : (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                            >
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis 
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <YAxis 
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickFormatter={(value) => `₹${value}`}
                                    tickMargin={10}
                                />
                                <Tooltip
                                    formatter={(value) => [`₹${value}`, "Price"]}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    isAnimationActive={true}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CryptoChart