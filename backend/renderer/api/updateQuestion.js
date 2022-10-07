function updateQuestion(args, db) {

  return new Promise((resolve) => {
    db.serialize(function () {
      var stmt = db.prepare(
        "REPLACE INTO question (question_id,question_text,question_type_id,marks,course_id,taxonomy_id,unit_id) VALUES (?,?,?,?,?,?,?)"
      );

      stmt.run(
        args.question_id,
        args.question_text,
        args.question_type_id,
        args.marks,
        args.course_id,
        args.taxonomy_id,
        args.unit_id, (_) => { if (_) resolve({ error: "❌ Question Could Not Be Replaced", status: -1 }) });

      stmt.finalize();

      stmt = db.prepare(
        "DELETE FROM course_outcomes_question WHERE question_id = ? "
      );

      stmt.run(args.question_id, (_) => { if (_) resolve({ error: "❌ Course Outcomes Could Not Be Deleted ", status: -1 }) });

      stmt.finalize();

      args.cource_outcome_ids.forEach((value) => {
        stmt = db.prepare(
          "INSERT INTO course_outcomes_question(question_id,course_outcomes_id) VALUES(?,?)"
        );

        stmt.run(args.question_id, value, (_) => { if (_) resolve({ error: "❌ Course Outcomes Could Not Be Insert ", status: -1 }) });
      });

      stmt.finalize();

      stmt = db.prepare(
        "DELETE FROM mcq_option WHERE question_id = ? "
      );

      stmt.run(args.question_id, (_) => { if (_) resolve({ error: "❌ MCQ Options Could Not Be Deleted ", status: -1 }) });

      if (args.isMCQ) {

        args.options.forEach((value) => {
          stmt = db.prepare(
            "INSERT INTO mcq_option(question_id,option_text) VALUES(?,?)"
          );

          stmt.run(args.question_id, value, (_) => { if (_) resolve({ error: "❌ MCQ Options Could Not Be Inserted ", status: -1 }) });
        })
      }


      stmt.finalize();

      resolve({ error: "✅ Question Updated Successfully", status: 1 })
    });
  })

}

module.exports = updateQuestion;
