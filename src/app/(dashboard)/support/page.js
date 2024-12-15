import AccordionTab from "@/components/ui/accordion-tab"

const SupportPage = () => {
    const accordionData = [
        {
            id: 1,
            title: "What is CopySure?",
            content:
                "CopySure is a platform designed for evaluating written documents or copies. Users can upload PDF files, and designated evaluators such as teachers or checkers can assess the content and provide scores or feedback.",
        },
        {
            id: 2,
            title: "How does role-based access work on CopySure?",
            content: (
                <>
                    CopySure operates on a role-based access system:
                    <ul className="list-disc ml-5 mt-2">
                        <li>
                            <strong>Uploaders</strong> can submit their copies in PDF format for
                            evaluation.
                        </li>
                        <li>
                            <strong>Checkers/Teachers</strong> can view uploaded copies, evaluate
                            them, and assign scores or feedback.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 3,
            title: "Who can use CopySure?",
            content: (
                <>
                    CopySure is intended for:
                    <ul className="list-disc ml-5 mt-2">
                        <li>Students or individuals who want their work evaluated.</li>
                        <li>
                            Teachers, instructors, or designated checkers who will review and
                            provide feedback on the uploaded files.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            id: 4,
            title: "What file formats are supported for upload?",
            content: "Currently, CopySure supports PDF files for upload.",
        },
        {
            id: 5,
            title: "How do I upload a copy for evaluation?",
            content: (
                <>
                    To upload a copy:
                    <ol className="list-decimal ml-5 mt-2">
                        <li>Log in to your account.</li>
                        <li>Navigate to the upload section.</li>
                        <li>Select the PDF file you want to upload and submit it.</li>
                    </ol>
                </>
            ),
        },
        {
            id: 6,
            title: "How are scores or feedback provided?",
            content:
                "Checkers/Teachers can view the uploaded PDF, evaluate it based on predefined criteria, and assign scores or provide detailed feedback within the platform.",
        },
        {
            id: 7,
            title: "Is my data secure on CopySure?",
            content:
                "Yes, CopySure prioritizes user data security. Uploaded files and evaluations are stored securely and are accessible only to authorized users.",
        },
        {
            id: 8,
            title: "Can I edit or delete my uploaded files?",
            content:
                "Yes, you can edit or delete your uploaded files unless they have already been evaluated.",
        },
        {
            id: 9,
            title: "How do I become a checker or evaluator on CopySure?",
            content:
                "To become a checker, you need to register and be approved by the admin. Your account will be assigned the appropriate role for evaluating submissions.",
        },
        {
            id: 10,
            title: "What happens after a copy is evaluated?",
            content:
                "Once evaluated, the uploader will receive a notification with the assigned score or feedback. The evaluated copy will remain accessible in the uploader’s account.",
        },
    ]

    return (
        <div>
            <h2 className="mr-auto mb-5 mt-5 max-w-max font-sugar-magic text-3xl leading-tight text-primary-heading lg:text-5xl">
                Frequently Asked Questions
            </h2>
            <div className="w-full">
                <AccordionTab contentClass="max-w-4xl" data={accordionData} />
            </div>
        </div>
    )
}

export default SupportPage
