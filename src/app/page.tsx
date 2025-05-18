'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PriceCard from "@/myComponents/PriceCard";
import { useAllCryptos } from "@/hooks/useAllCryptos";
import { Skeleton } from "@/components/ui/skeleton";
import CryptoChart from "@/myComponents/CryptoChart";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bgColor, setBgColor] = useState("bg-slate-100");

  const { isLoading, error } = useAllCryptos();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setBgColor(resolvedTheme === "dark" ? "bg-black" : "bg-slate-100");
    }
  }, [resolvedTheme, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className={`poppins ${bgColor} p-2 min-h-screen`}>
        <div className="flex flex-row gap-4 items-center mt-8 w-[65vw]">
          {[1, 2, 3].map((key) => (
            <Skeleton
              key={key}
              className={`h-[85px] w-[322px] rounded-xl ${
                resolvedTheme === "dark" ? "bg-[#1f1f1f]" : "bg-white"
              }`}
            />
          ))}
        </div>

        {/* 🔄 CryptoChart Skeleton Placeholder */}
        <div className="mt-8 ml-3">
          <Skeleton
            className={`h-[240px] w-[90vw] rounded-xl ${
              resolvedTheme === "dark" ? "bg-[#1f1f1f]" : "bg-white"
            }`}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading data</div>;
  }

  return (
    <div className={`poppins ${bgColor} p-2 min-h-screen`}>
      <PriceCard />
      <CryptoChart />
    </div>
  );
}
