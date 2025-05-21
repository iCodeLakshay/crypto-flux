import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type CryptoData = {
    name: string,
    icon: string,
    price: number,
    volume: number | null,
    marketRank: number,
    marketCap: number,
    changePercentage: number,
    highIn24: number,
    lowIn24: number;
};

export const cryptoColumns : ColumnDef<CryptoData>[] = [
    {
        accessorKey: "name",
        header: "NAME",
        cell: ({row}) => (
            <div className="w-fit flex items-center space-x-2">
                <Image 
                    src={row.original.icon}
                    alt={row.original.name}
                    className="w-6 h-6"
                    width={24}
                    height={24}
                />             
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => {
            const price = getValue() as number;
            const formattedPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(price);
            return <span className="font-medium">{formattedPrice}</span>
        }
    },
    {
        accessorKey: "volume",
        header: "Volume",
        cell: ({ getValue }) => (
            <span className="font-medium">${parseFloat(getValue() as string).toLocaleString()}</span>
        )
    },
    {
        accessorKey: "marketCap",
        header: "Market Cap",
        cell: ({ getValue }) => (
            <span className="font-medium">{parseFloat(getValue() as string).toLocaleString()}</span>
        )
    },
    {
        accessorKey: "highIn24",
        header: "Highest Price",
        cell: ({ getValue }) => {
            const price = getValue() as number;
            const formattedPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(price);
            return <span className="font-medium">{formattedPrice}</span>;
        }
    },
    {
        accessorKey: "lowIn24",
        header: "Lowest Price",
        cell: ({ getValue }) => {
            const price = getValue() as number;
            const formattedPrice = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(price);
            return <span className="font-medium">{formattedPrice}</span>;
        }
    },
    {
        accessorKey: "changePercentage",
        header: "24h Change",
        cell: ({ getValue }) => {
            const value = getValue() as number;
            const colorClass = value >= 0 ? "text-green-500": "text-red-500";
            return <span className={`font-medium ${colorClass}`}>{value.toFixed(2)}%</span>
        },
    },
]