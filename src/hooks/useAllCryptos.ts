'use client'

import {useQuery} from '@tanstack/react-query'
import {fetchAllCryptos} from '../data/allCrypto'

export function useAllCryptos() {
    return useQuery({
        queryKey: ['allcryptos'],
        queryFn: async () => {
            const data =await fetchAllCryptos();
            return data;
        },
    staleTime: 0,    
    });
}