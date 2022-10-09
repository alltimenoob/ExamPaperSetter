const getUnits = (args, database) => {
    return new Promise((resolve) => {
        const query = "SELECT * FROM unit WHERE course_id = ?";
        database.all(query, [args], (error, rows) => {
            if (error !== null) resolve({ error: "❌ Error Fetching Unit Data ", data: null, status: -1 })
            resolve({ error: "✅ Successfully Fetched ", data: rows, status: 1 })
        })
    })
}

module.exports = getUnits;