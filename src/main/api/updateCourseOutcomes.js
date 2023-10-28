
const updateCourseOutcomes = (args, database) => {
    return new Promise((resolve) => {
        database.serialize(() => {

            var stmt = database.prepare("DELETE FROM course_outcomes WHERE course_id = ?");

            stmt.run(args.course_id, (_) => { if (_) resolve({ error: "❌ Course Outcomes Could Not Be Deleted ", status: -1 }) })

            stmt.finalize();

            args.data.forEach(element => {
                stmt = database.prepare("REPLACE INTO course_outcomes(course_outcomes_id,course_outcomes_number,course_outcomes_description,course_id)" +
                    " VALUES(?,?,?,?)");

                if (element.added)
                    element.course_outcomes_id = null;

                console.log(element)

                stmt.run([element.course_outcomes_id, element.course_outcomes_number, element.course_outcomes_description, args.course_id], (_) => { if (_) resolve({ error: "❌ Course Outcomes Could Not Be Inserted ", status: -1 }) })

                stmt.finalize();
            });

            resolve({ error: "✅ Course Outcomes Updated Successfully ", status: 1 })
        })
    })

};

export default updateCourseOutcomes;