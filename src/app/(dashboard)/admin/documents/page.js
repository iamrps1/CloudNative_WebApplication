"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, Download } from "lucide-react"
import { toast } from "sonner"

export default function AdminDocumentsPage() {
    const { data: session } = useSession()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.role === "admin") {
            loadAllDocuments()
        }
    }, [session])

    const loadAllDocuments = async () => {
        try {
            const response = await fetch("/api/documents")
            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || "Failed to load documents")
            }
            const data = await response.json()
            console.log(data)
            setDocuments(data)
        } catch (error) {
            console.error("Error loading documents:", error)
            toast.error("Failed to load documents")
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            accessorKey: "fileName",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        File Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "teacherName",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Teacher Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "teacherEmail",
            header: "Teacher Email",
        },
        {
            accessorKey: "subject",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Subject
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                )
            },
        },
        {
            accessorKey: "teacherSubjects",
            header: "Teacher's Subjects",
        },
        {
            accessorKey: "uploadDate",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Upload Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                )
            },
            cell: ({ row }) => {
                return new Date(row.original.uploadDate).toLocaleDateString()
            },
        },
    ]

    const table = useReactTable({
        data: documents,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    if (!session || session.user.role !== "admin") {
        return <div className="text-center py-8 text-gray-500">You don&apos;t have permission to view this page.</div>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Uploaded Documents</h1>

            <div className="overflow-x-auto rounded-md border">
                <table className="w-full table-fixed border-collapse">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        style={{
                                            width:
                                                header.column.id === "fileName" || header.column.id === "teacherEmail"
                                                    ? "20%"
                                                    : "15%",
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-700 truncate">
                                        <div className="truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 py-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
