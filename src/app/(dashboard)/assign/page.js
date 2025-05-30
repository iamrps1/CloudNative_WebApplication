"use client"
import { useState } from "react"
import DepartmentStep from "@/components/assign/DepartmentStep"
import SubjectStep from "@/components/assign/SubjectStep"
import TeacherStep from "@/components/assign/TeacherStep"
import UploadStep from "@/components/assign/UploadStep"
import StepperWizard from "@/components/ui/StepperWizard"
import { useSession } from "next-auth/react"

export default function AssignPage() {
    const steps = [
        {
            label: "Select Department",
            key: "department",
            component: DepartmentStep,
            props: () => ({}),
        },
        {
            label: "Select Subject",
            key: "subject",
            component: SubjectStep,
            props: (data) => ({ department: data.department }),
        },
        {
            label: "Select Teacher",
            key: "teacher",
            component: TeacherStep,
            props: (data) => ({ subject: data.subject }),
        },
        {
            label: "Upload PDF",
            key: "upload",
            component: UploadStep,
            props: (data) => ({
                department: data.department,
                subject: data.subject,
                teacher: data.teacher,
                onReset: () => setStepData({ department: null, subject: null, teacher: null, upload: null }),
            }),
        },
    ]
    const { data: session } = useSession()
    const [stepData, setStepData] = useState({
        department: null,
        subject: null,
        teacher: null,
        upload: null,
    })
    // Find the current step index
    const currentStep = steps.findIndex((step, idx) => {
        if (idx === 0) return !stepData.department
        if (idx === 1) return stepData.department && !stepData.subject
        if (idx === 2) return stepData.department && stepData.subject && !stepData.teacher
        if (idx === 3) return stepData.department && stepData.subject && stepData.teacher
        return false
    })
    const [stepIdx, setStepIdx] = useState(currentStep === -1 ? 0 : currentStep)

    if (session?.user?.role !== "admin") {
        return <div>Access denied</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Assign Copy to Teacher</h1>
            <StepperWizard
                steps={steps}
                stepData={stepData}
                setStepData={setStepData}
                currentStep={stepIdx}
                setCurrentStep={setStepIdx}
            />
        </div>
    )
}
