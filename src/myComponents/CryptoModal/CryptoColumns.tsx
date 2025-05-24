import { Column, ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuArrowDown } from "react-icons/lu";
import { IoArrowUpSharp, IoArrowDownSharp } from "react-icons/io5";

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

interface SortableHeaderProps{
    column: Column<CryptoData, unknown>,
    label: string;
}

function sortingIcon(isSorted: boolean | string){
    if(isSorted === 'asc') return <IoArrowUpSharp />
    else if(isSorted === 'desc') return <IoArrowDownSharp />
    else return <LuArrowDown />
}

function SortableHeader( {column, label}: SortableHeaderProps) {
    const isSorted = column.getIsSorted();

    return(
        <Button
        variant="ghost"
        className={`${isSorted && "text-primary"}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {sortingIcon(isSorted)}
            {label}
        </Button>
    );
}

export const cryptoColumns : ColumnDef<CryptoData>[] = [
    {
        accessorKey: "name",
        header: ({column}) => { return <SortableHeader column={column} label="Name" /> },
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
        filterFn: 'includesString',
        enableColumnFilter: true,
    },
    {
        accessorKey: "price",
        header: ({column}) => { return <SortableHeader column={column} label="Price" /> },
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
        header: ({column}) => { return <SortableHeader column={column} label="Volume" /> },
        cell: ({ getValue }) => (
            <span className="font-medium">${parseFloat(getValue() as string).toLocaleString()}</span>
        )
    },
    {
        accessorKey: "marketCap",
        header: ({column}) => { return <SortableHeader column={column} label="Market Cap" /> },
        cell: ({ getValue }) => (
            <span className="font-medium">{parseFloat(getValue() as string).toLocaleString()}</span>
        )
    },
    {
        accessorKey: "highIn24",
        header: ({column}) => { return <SortableHeader column={column} label="Highest Price" /> },
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
        header: ({column}) => { return <SortableHeader column={column} label="Lowest Price" /> },
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
        header: ({column}) => { return <SortableHeader column={column} label="24h Change" /> },
        cell: ({ getValue }) => {
            const value = getValue() as number;
            const colorClass = value >= 0 ? "text-green-500": "text-red-500";
            return <span className={`font-medium ${colorClass}`}>{value.toFixed(2)}%</span>
        },
    },
]