import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type CryptoData = {
    name: string,
    icon: string,
    price: number,
    volume: number,
    marketRank: number,
    marketCap: number,
    changePercentage: number,
    highIn24: number,
    lowIn24: number;
};

export const cryptoColumns : ColumnDef<CryptoData>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({row}) => (
            <div className="flex items-center space-x-2">
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
            const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(price);
            return <span className="font-medium">{formattedPrice}</span>
        }
    },
    {
        accessorKey: "volumne",
        header: "Volume",
        cell: ({ getValue }) => (
            <pre>${parseFloat(getValue() as string).toLocaleString()}</pre>
        )
    },
    {
        accessorKey: "marketCap",
        header: "Market Cap",
        cell: ({ getValue }) => (
            <pre>{parseFloat(getValue() as string).toLocaleString()}</pre>
        )
    },
    {
        accessorKey: "highIn24",
        header: "Highest Price",
        cell: ({ getValue }) => {
            const price = getValue() as number;
            const formattedPrice = new Intl.NumberFormat("en-US", {
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
            const formattedPrice = new Intl.NumberFormat("en-US", {
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