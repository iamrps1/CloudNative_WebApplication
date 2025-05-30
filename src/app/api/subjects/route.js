export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get("departmentId")

    // Mock data
    const allSubjects = {
        cs: [
            { id: "dsa", name: "Data Structure", totalTeachers: 2 },
            { id: "web", name: "Web Development", totalTeachers: 1 },
        ],
        ee: [{ id: "em", name: "Electrical Machines", totalTeachers: 2 }],
    }

    return Response.json(allSubjects[departmentId] || [])
}
