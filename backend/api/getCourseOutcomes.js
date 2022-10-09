const getCourseOutcomes = (args, database) => {
    return new Promise((resolve) => {
        const query = "SELECT * FROM course_outcomes WHERE course_id = ?";
        database.all(query, [args], (error, rows) => {
            if (error !== null) resolve({ error: "❌ Error Fetching Course Outcomes Data ", data: null, status: -1 })
            resolve({ error: "✅ Successfully Fetched ", data: rows, status: 1 })
        })
    })
}

module.exports = getCourseOutcomes;