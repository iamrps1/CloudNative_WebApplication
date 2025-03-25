// Helper function to convert DynamoDB attribute values to plain JavaScript values
export function convertFromDynamoDB(item) {
    if (!item) return null
    const result = {}
    for (const [key, value] of Object.entries(item)) {
        if (value.S) result[key] = value.S
        else if (value.N) result[key] = Number(value.N)
        else if (value.L) result[key] = value.L.map((v) => v.S || (v.N && Number(v.N)))
        else result[key] = value
    }
    return result
}
