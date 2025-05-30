"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

export default function TeacherStep({ subject, onSelect }) {
    const [selected, setSelected] = useState("")
    const { data: teachers = [], isLoading } = useQuery({
        queryKey: ["teachers", subject.name],
        queryFn: async () =>
            (await fetch(`/api/teachers/by-subject?subject=${encodeURIComponent(subject.name)}`)).json(),
    })

    console.log("Data: ", teachers)

    const columns = [
        { header: "Sn. No.", cell: ({ row }) => row.index + 1 },
        { accessorKey: "name", header: "Teacher Name" },
        { accessorKey: "subjects", header: "Teacher Subjects", cell: ({ row }) => row.original.subjects.join(", ") },
        { accessorKey: "totalAssigned", header: "Total Assigned" },
        { accessorKey: "totalChecked", header: "Total Checked" },
        { accessorKey: "totalRemaining", header: "Total Remaining" },
    ]

    const table = useReactTable({
        data: teachers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <select
                value={selected}
                onChange={(e) => {
                    setSelected(e.target.value)
                    const teacher = teachers.find((t) => t.id === e.target.value)
                    if (teacher) onSelect(teacher)
                }}
                className="border rounded p-2 mb-4 bg-black text-white"
            >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>
            <table className="w-full border">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="border p-2">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="hover:bg-gray-800 cursor-pointer"
                            onClick={() => {
                                setSelected(row.original.id)
                                onSelect(row.original)
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
