"use client"
import { useQuery } from "@tanstack/react-query"

export default function AssignmentHistory({ teacherId }) {
    const { data = [], isLoading } = useQuery({
        queryKey: ["assignmentHistory", teacherId],
        queryFn: async () => {
            const res = await fetch(`/api/assignment-history?teacherId=${teacherId}`)
            return res.json()
        },
    })

    if (isLoading) return <div>Loading history...</div>
    if (!data.length) return <div>No assignments found.</div>

    return (
        <div className="mt-8">
            <h2 className="font-bold mb-2">Assignment History</h2>
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">File</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td className="border p-2">
                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {item.fileName}
                                </a>
                            </td>
                            <td className="border p-2">{new Date(item.assignedAt).toLocaleString()}</td>
                            <td className="border p-2">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
