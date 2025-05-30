import Image from "next/image"
import React from "react"

const EvaluationPage = () => {
    return <div>Evaluation Page
        <div>
            <Image src='/evaluation.jpeg' className="w-full" width={500} height={300} alt="Evaluation" />
        </div>
    </div>
}

export default EvaluationPage
