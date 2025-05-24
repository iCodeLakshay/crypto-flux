'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PriceCard from "@/myComponents/PriceCard";
import CryptoChart from "@/myComponents/CryptoChart";
import CryptoOverview from "@/myComponents/CryptoOverview";
import MarketTable from "@/myComponents/CryptoModal/MarketTable";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [bgColor, setBgColor] = useState("bg-slate-100");


  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setBgColor(resolvedTheme === "dark" ? "bg-black" : "bg-slate-100");
    }
  }, [resolvedTheme, mounted]);

  return (
    <div className={`poppins ${bgColor} px-2 py-5 min-h-screen`}>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 auto-rows-min">
        <div className="flex items-center lg:col-span-3"> <PriceCard /> </div>
        <div className="lg:col-span-2 lg:row-span-5 flex"> <CryptoOverview /> </div>
        <div className="lg:col-span-3 lg:row-span-4"> <CryptoChart /> </div>
        <div className="lg:col-span-5"> <MarketTable /> </div>
      </div>
    </div>
  );
}
