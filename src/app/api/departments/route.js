export async function GET() {
    // Mock data
    const departments = [
        {
            id: "cs",
            name: "Computer Science",
            subjects: [
                { id: "dsa", name: "DSA" },
                { id: "web", name: "Web Development" },
            ],
            totalSubjects: 2,
            totalTeachers: 3,
        },
        {
            id: "ee",
            name: "Electrical",
            subjects: [{ id: "em", name: "Electrical Machines" }],
            totalSubjects: 1,
            totalTeachers: 2,
        },
    ]
    return Response.json(departments)
}
