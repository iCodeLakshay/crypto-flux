"use client"

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnFiltersState,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Pagination } from "./Pagination/Pagination"
import { useAppStore } from "@/hooks/useAppStore"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    initialPageSize?: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    initialPageSize = 8
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([]);
    const {openTableDialog, search} = useAppStore();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: initialPageSize,
            },
        },
    })

    const handlePageChange = (page: number) => {
        table.setPageIndex(page - 1);
    }

    const handlePageSizeChange = (pageSize: number) => {
        table.setPageSize(pageSize)
    }

    // function updateInputChange(event:ChangeEvent<HTMLInputElement>){
    //     table.getColumn("name")?.setFilterValue(event.target.value);
    // }

    useEffect(()=>{
        if(search.length > 0 && openTableDialog){
            table.getColumn("name")?.setFilterValue(search);
        } else {
            table.getColumn("name")?.setFilterValue("");
        }
    }, [openTableDialog, search, table]);

    const downloadAsCSV = () => {
        const headers = Object.keys(data[0] || {});

        const csvContent = [
            headers.join(","),
            ...data.map((items) => {
                headers.map((header) => items[header as keyof typeof items] ?? "").join(",")
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cryptos.csv";
        link.click();
        link.style.display = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between py-4 mb-4">
                <Input
                    placeholder="Filter Cryptos..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <button onClick={downloadAsCSV} className="border rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white">
                    Download as CSV
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                currentPage={table.getState().pagination.pageIndex + 1}
                totalPages={table.getPageCount()}
                pageSize={table.getState().pagination.pageSize}
                totalItems={table.getFilteredRowModel().rows.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[8, 16, 25, 50]}
            />
        </div>
    )
}