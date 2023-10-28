function updateQuestion(args, db) {

  return new Promise((resolve) => {
      db.serialize(function () {

          var stmt = db.prepare(
              "INSERT INTO question (question_text,question_type_id,marks,course_id,taxonomy_id,unit_id,question_image) VALUES (?,?,?,?,?,?,?)"
          );

          stmt.run(
              args.question_text,
              args.question_type_id,
              args.marks,
              args.course_id,
              args.taxonomy_id,
              args.unit_id,
              args.question_image, (_) => { if (_) resolve({ error: "❌ Question Already Exists ", status: -1 }) });

          stmt.finalize();

          const insertCourseOutcomes = (id) => {
              var stmt = db.prepare("INSERT INTO course_outcomes_question(question_id,course_outcomes_id) VALUES(?,?)");

              args.cource_outcome_ids.forEach(element => {
                  stmt.run(id, element)
              });

              stmt.finalize();

              resolve({ error: "✅ Question Added Successfully", status: 1 })
          }

          db.get("SELECT last_insert_rowid()", (_, row) => {
              if (_) resolve({ error: "❌ Could Not Find The ID For Question", status: -1 })
              insertCourseOutcomes(row["last_insert_rowid()"])
          });

      });
  })
}

export default updateQuestion;
