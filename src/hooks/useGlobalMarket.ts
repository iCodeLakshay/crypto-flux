'use client';

import { fetchMarketGlobal } from "@/data/globalMarketData";
import { useQuery } from "@tanstack/react-query";

export function useGlobalMarket() {
    return useQuery<unknown, Error>({
        queryKey: ["globalMarket"],
        queryFn: async () => {
            const data = await fetchMarketGlobal();
            // console.log("Global Market Data:", data);
            return data;  
        },
        staleTime: 1000 * 60 * 5,
    });
}