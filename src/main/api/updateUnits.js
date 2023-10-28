
const updateUnits = (args, database) => {

    return new Promise((resolve) => {
        console.log(args)
        database.serialize(() => {

            var stmt = database.prepare("DELETE FROM unit WHERE course_id = ?");

            stmt.run(args.course_id, (_) => { if (_) resolve({ error: "❌ Units Could Not Be Deleted ", status: -1 }) })

            stmt.finalize();

            args.data.forEach(element => {
                stmt = database.prepare("REPLACE INTO unit(unit_id,unit_name,course_id)" +
                    "VALUES(?,?,?)");

                if (element.added)
                    element.unit_id = null;

                stmt.run([element.unit_id, element.unit_name, args.course_id], (_) => { if (_) resolve({ error: "❌ Units Could Not Be Inserted ", status: -1 }) })

                stmt.finalize();
            });

            resolve({ error: "✅ Units Updated Successfully ", status: 1 })
        })
    })

};

module.exports = updateUnits;