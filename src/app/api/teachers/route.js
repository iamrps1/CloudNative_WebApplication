export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get("subjectId")

    // Mock data
    const allTeachers = {
        dsa: [
            {
                id: "t1",
                name: "Striver",
                subjects: ["DSA", "Web Development"],
                totalAssigned: 10,
                totalChecked: 7,
                totalRemaining: 3,
            },
            {
                id: "t2",
                name: "Alice",
                subjects: ["DSA"],
                totalAssigned: 5,
                totalChecked: 5,
                totalRemaining: 0,
            },
        ],
        web: [
            {
                id: "t1",
                name: "Striver",
                subjects: ["DSA", "Web Development"],
                totalAssigned: 10,
                totalChecked: 7,
                totalRemaining: 3,
            },
        ],
        em: [
            {
                id: "t3",
                name: "Bob",
                subjects: ["Electrical Machines"],
                totalAssigned: 8,
                totalChecked: 6,
                totalRemaining: 2,
            },
        ],
    }

    return Response.json(allTeachers[subjectId] || [])
}
