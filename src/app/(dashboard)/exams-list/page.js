import { DataTable } from "@/components/data-table"
import { examColumns } from "@/components/columns"
import { mockExams } from "./mock-data"

const ExamList = () => {
    return (
        <div>
            Exam List
            <DataTable columns={examColumns} data={mockExams} />
        </div>
    )
}

export default ExamList
