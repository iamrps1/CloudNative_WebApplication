import React from "react"

export default function StepperWizard({ steps, stepData, setStepData, currentStep, setCurrentStep }) {
    // Breadcrumb for choices
    const choices = steps.slice(0, currentStep + 1).map((step, idx) => {
        const value = stepData[step.key]
        return value ? value.name || value : step.label
    })

    return (
        <div>
            {/* Stepper */}
            <div className="flex items-center mb-4">
                {steps.map((step, idx) => (
                    <div key={step.label} className="flex items-center">
                        <div
                            className={`rounded-full w-8 h-8 flex items-center justify-center font-bold
                            ${idx <= currentStep ? "bg-accent text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                            {idx + 1}
                        </div>
                        <span className={`ml-2 mr-4 ${idx <= currentStep ? "text-accent" : "text-gray-400"}`}>
                            {step.label}
                        </span>
                        {idx < steps.length - 1 && (
                            <span
                                className={`w-8 h-1 ${idx < currentStep ? "bg-accent" : "bg-gray-200"} rounded-full`}
                            ></span>
                        )}
                    </div>
                ))}
            </div>
            {/* Breadcrumb for choices */}
            <div className="flex items-center mb-8">
                {choices.map((choice, idx) => (
                    <span key={choice + idx} className="flex items-center">
                        <span className="font-semibold text-accent">{choice}</span>
                        {idx < choices.length - 1 && <span className="mx-2 text-gray-400">{">"}</span>}
                    </span>
                ))}
            </div>
            {/* Step Content */}
            <div>
                {steps.map((step, idx) => {
                    if (idx !== currentStep) return null
                    const StepComponent = step.component
                    return (
                        <div key={step.label}>
                            {idx > 0 && (
                                <button
                                    className="mb-4 bg-black text-white border border-white px-3 py-1 rounded"
                                    onClick={() => {
                                        // Reset current and all next steps
                                        const newStepData = { ...stepData }
                                        steps.slice(idx).forEach((s) => {
                                            newStepData[s.key] = null
                                        })
                                        setStepData(newStepData)
                                        setCurrentStep(idx - 1)
                                    }}
                                >
                                    ← Back
                                </button>
                            )}
                            <StepComponent
                                {...step.props(stepData)}
                                onSelect={(value) => {
                                    const newStepData = { ...stepData, [step.key]: value }
                                    setStepData(newStepData)
                                    setCurrentStep(idx + 1)
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
