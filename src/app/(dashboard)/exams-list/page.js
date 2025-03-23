import Image from "next/image"
import { DataTable } from "@/components/table"

const ExamList = () => {
    return (
        <div>
            Exam List
            <div>
                <Image src="/examlist.jpeg" className="w-full" width={500} height={300} alt="Exam List" />
            </div>
            <DataTable />
        </div>
    )
}

export default ExamList
