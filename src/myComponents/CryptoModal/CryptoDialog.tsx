import { useEffect, useState } from "react";
import { cryptoColumns, CryptoData } from "./CryptoColumns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { DataTable } from "./DataTable";
import {allCryptoTypes} from "@/data/allCrypto";
import { useAppStore } from "@/hooks/useAppStore";

type SingleCoinType = Pick<allCryptoTypes[number],
    | "name"
    | "image"
    | "current_price"
    | "total_volume"
    | "market_cap_rank"
    | "market_cap"
    | "price_change_percentage_24h"
    | "high_24h"
    | "low_24h"
>


export function CryptoTableDialog({allCoins,}:{allCoins: allCryptoTypes;}){
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const {openTableDialog, setOpenDialog, setSearch} = useAppStore();

    useEffect(() => {
        const formattedData : CryptoData[] = allCoins.map(
            (coin: SingleCoinType) => ({
                name: coin.name,
                icon: coin.image,
                price: coin.current_price,
                volume: coin.total_volume,
                marketRank: coin.market_cap_rank,
                marketCap: coin.market_cap,
                changePercentage: coin.price_change_percentage_24h,
                highIn24: coin.high_24h,
                lowIn24: coin.low_24h,
            })
        );
        setCryptoData(formattedData);
        // console.log("Formatted Data: ",formattedData);
        
    }, [allCoins]);

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
        if (!open) {
            setSearch("");
        }
    };

    return (
        <Dialog open={openTableDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"link"} className="h-10">
                    See all
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 poppins min-w-[85rem] max-h-svh overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        All Cryptocurrencies
                    </DialogTitle>
                    <DialogDescription>
                        View detailed list of all cryptocurrencies,
                        including their prices, market capitalization, and other key details.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex-grow overflow-auto pr-2">
                    <DataTable columns={cryptoColumns} data={cryptoData}/>
                </div>
            </DialogContent>
        </Dialog>
    )



}