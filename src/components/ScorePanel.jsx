export default function ScorePanel({
    questions,
    marks,
    maxMarks = [],
    comments = {},
    onMarkChange,
    onCommentChange,
    onFinish,
    onSave,
    onExportPDF,
}) {
    const total = questions.reduce((sum, q, idx) => sum + (Number(marks[idx]) || 0), 0)

    return (
        <div className="w-80 bg-slate-900 h-full shadow-lg p-6 flex flex-col border-l border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Evaluation</h2>
            <div className="flex-1 overflow-y-auto">
                {questions.map((q, idx) => (
                    <div key={idx} className="mb-4">
                        <div className="font-medium mb-1 text-slate-100">
                            Q{idx + 1}
                            {maxMarks[idx] !== undefined && (
                                <span className="ml-2 text-xs text-slate-400">(out of {maxMarks[idx]})</span>
                            )}
                        </div>
                        <input
                            type="number"
                            min={0}
                            max={maxMarks[idx]}
                            className={`w-full border border-slate-700 bg-slate-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                Number(marks[idx]) === maxMarks[idx] ? "border-green-500" : ""
                            }`}
                            value={marks[idx] || ""}
                            onChange={(e) => onMarkChange(idx, e.target.value)}
                        />
                        <textarea
                            className="w-full mt-2 border border-slate-700 bg-slate-800 text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="Comment (optional)"
                            value={comments[idx] || ""}
                            onChange={(e) => onCommentChange && onCommentChange(idx, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-4 text-lg font-semibold text-white">Total: {total}</div>
            <button
                className="mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={onFinish}
            >
                Finish Evaluation
            </button>
            {onSave && (
                <button
                    className="mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    onClick={onSave}
                >
                    Save Evaluation
                </button>
            )}
            {onExportPDF && (
                <button
                    className="mt-2 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                    onClick={onExportPDF}
                >
                    Export Annotated PDF
                </button>
            )}
        </div>
    )
}
