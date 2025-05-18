'use client';

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PriceCard from "@/myComponents/PriceCard";
import CryptoChart from "@/myComponents/CryptoChart";

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
      <PriceCard />
      <CryptoChart />
    </div>
  );
}
