'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PriceCard from "@/myComponents/PriceCard";
import CryptoChart from "@/myComponents/CryptoChart";
import CryptoOverview from "@/myComponents/CryptoOverview";

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
    <div className={`poppins ${bgColor} p-2 min-h-screen`}>

      <div className="grid grid-cols-5 grid-rows-5 gap-4">
        <div className="col-span-3 flex items-center"><PriceCard /></div>
        <div className="col-span-3 row-span-4 col-start-1 row-start-2"><CryptoChart /></div>
        <div className="col-span-2 row-span-5 col-start-4 row-start-1 flex mt-2"><CryptoOverview /></div>
      </div>
    </div>
  );
}
