import Image from "next/image"
import { DataTable } from "@/components/data-table"
import { examColumns } from "@/components/columns"
import { mockExams } from "./mock-data"

const ExamList = () => {
    return (
        <div>
            Exam List
            <div>
                <Image src="/examlist.jpeg" className="w-full" width={500} height={300} alt="Exam List" />
            </div>
            <DataTable columns={examColumns} data={mockExams} />
        </div>
    )
}

export default ExamList
