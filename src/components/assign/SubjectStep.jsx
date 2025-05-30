"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"

export default function SubjectStep({ department, onSelect }) {
    const [selected, setSelected] = useState("")
    const { data: subjects = [], isLoading } = useQuery({
        queryKey: ["subjects", department.id],
        queryFn: async () => (await fetch(`/api/subjects?departmentId=${department.id}`)).json(),
    })

    const columns = [
        { header: "Sn. No.", cell: ({ row }) => row.index + 1 },
        { accessorKey: "name", header: "Subject" },
        { accessorKey: "totalTeachers", header: "Total Teachers" },
    ]

    const table = useReactTable({
        data: subjects,
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
                    const subj = subjects.find((s) => s.id === e.target.value)
                    if (subj) onSelect(subj)
                }}
                className="border rounded p-2 mb-4 bg-black text-white"
            >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
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
