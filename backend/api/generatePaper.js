const { isLabelWithInternallyDisabledControl } = require("@testing-library/user-event/dist/utils");

const generatePaper = (args,fs,outputPath) => {
    const MetaData = args.MetaData;
    const ExamPaper = args.ExamPaper;
    
    args = args.QuestionDetails;
  
    let questionsCode = "";
  
    const headerCode = `
      \\hspace{-7mm}ID No.\\rule{20mm}{0.3mm}
      \\begin{center}
   \\textbf{Birla Vishwakarma Mahavidhyalaya(Engineering College)} \\\\
    \\textbf{\\textit{(An Autonomous Institute)}} \\\\
    \\textbf{${MetaData.Year} Year, ${MetaData.Stream}} \\\\
    \\textbf{${MetaData.ExamType} ,${MetaData.Semester},AY ${MetaData.AY}} \\\\
    \\vspace{4mm}
   
   
    \\end{center}
   
  %Course code, title, maximum marks, date, time
    \\hspace{-7mm}
    \\parbox[t]{50mm}{\\textbf{Course Code: ${MetaData.CourseCode}}}
    \\parbox[t]{100mm}{\\textbf{Course Title: ${MetaData.CourseName
      }}}\\vspace{2mm}\\\\
    \\parbox[t]{50mm}{\\textbf{Date: ${MetaData.Date}}}
    \\parbox[t]{75mm}{\\textbf{Time : ${MetaData.Time}}}
    \\parbox[t]{50mm}{\\textbf{Maximum Marks: ${MetaData.TotalMarks}}}\\\\
    \\line(1,0){170mm} \\vspace{2mm}
    \\hspace{-6mm}\\textbf{Instruction}
  
   
  %instruction section
  
    \\begin{itemize}[leftmargin=4mm,rightmargin=-2cm]
        \\item Numbers in the square brackets to the right indicate maximum marks.
       ${MetaData.Instructions.map((value) => {
        return "\\item " + value.value;
      })}
        \\item The text just below marks indicates the Course Outcome Nos. (CO) followed by the Bloom’s taxonomy level of the question, i.e., R: Remember, U: Understand, A: Apply, N: Analyze, E: Evaluate, C: Create
    \\end{itemize}
    \\line(1,0){170mm}
   \\vspace{5mm}\n`;


  //Questions section begin here

  const section1=ExamPaper.sections[0]
  const section2=ExamPaper.sections[1]
  
  //For SECTION 1

  if(section2.length!==0) { //If section 2 exists
      questionsCode+=`\\begin{center}\n`
      questionsCode+=`\\underline{\\textbf{SECTION-1}}\\\\\n`
      questionsCode+=`\\end{center}\n`
  }

  questionsCode+=`\\begin{questions}\n`
  questionsCode+=`\\pointname{}\n`
  questionsCode+=`\\pointsinrightmargin\n`

  section1.forEach( question => {
      // For MCQ type Questions
      if( question.question_type_name === 'MCQ') {
          questionsCode += `\\question[${question.marks}] ${question.text.label}\n`+addMcqOptions(question);
      } else {
          questionsCode += addQuestion(question);
      }
  });

  questionsCode+=`\\end{questions}`

  if(section2.length!==0) {

      questionsCode+=`\\pagebreak\n`
      questionsCode+=`\\begin{center}\n`
      questionsCode+=`\\underline{\\textbf{SECTION-2}}\\\\\n`
      questionsCode+=`\\end{center}\n`

      //For SECTION 2
      questionsCode+=`\\begin{questions}\n`
      questionsCode+=`\\pointname{}\n`
      questionsCode+=`\\pointsinrightmargin\n`

      section2.forEach( question => {
          // For MCQ type Questions
          if( question.question_type_name === 'MCQ') {
              questionsCode += `\\question[${question.marks}] ${question.text.label}\n`+addMcqOptions(question);
          } else {
              questionsCode += addQuestion(question);
          }
      });

      questionsCode+=`\\end{questions}\n`
  }
  
    const examPaperCode =
      `\\documentclass[addpoints,12pt]{exam}
    \\usepackage[a4paper]{geometry}
    \\usepackage{enumitem}
    \\usepackage{amsmath,stackengine}
    \\geometry{
    a4paper,
    total={150mm,257mm},
    left=25mm,
    top=20mm,
    } 
   
    \\begin{document}` +
      headerCode +
      questionsCode +
      `\\end{document}`;
  
    fs.writeFileSync("./exam_paper.tex", examPaperCode);
  
    const { exec } = require("child_process");
  
    return new Promise((resolve, reject) => {
      exec(
        "pdflatex --output-directory=" +
        outputPath +
        " exam_paper.tex",
        (error, stdout, stderr) => {
          resolve(stdout.trim());
        }
      );
    });
  };


  function addMcqOptions(question) {
    let mcqCode=""
    mcqCode += `\\vspace{1.5mm}\n\\begin{oneparchoices}\\\\\n`;
    
    question.mcqs.forEach((option) => {
        mcqCode += `\t\\choice ${option.option_text}\n`;
    });

    mcqCode += `\\end{oneparchoices}\n\\vspace{1.5mm}\n`;
    return mcqCode;
}

function addQuestion(question) {
    let questionsCode=""
    if(question.subq.length===0) {
        questionsCode += `\\question[${question.text.marks}]\n`
        questionsCode += `\\vspace{-\\baselineskip}\\vspace{3.5mm}${question.text.label}\n`;
    } else {

        let label=question.text.label
        label=label===""?"Answere following":label
        questionsCode+=`\\question[${question.text.marks}]\n`
        questionsCode+=`\\vspace{-\\baselineskip}\\vspace{3.5mm}${label}\n`
        questionsCode+=`\\begin{parts}\n`
        question.subq.forEach(subQuestion => {
            if( subQuestion.question_type_name === 'MCQ') {
                questionsCode += `\\part[${subQuestion.marks}] ${subQuestion.text.label}\n`+addMcqOptions(subQuestion);
            } else if(subQuestion.subq.length===0) {
                questionsCode+=`\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}\\newline{${subQuestion.taxonomy_letter}}}}\n`
                questionsCode+=`\t\\part[${subQuestion.marks}] ${subQuestion.label}\n`
            } else {
                questionsCode+=`\t\\part[${subQuestion.text.marks}] ${subQuestion.text.label}\n`
                questionsCode+=`\\begin{subparts}\n`
                subQuestion.subq.forEach(subSubQuestion => {
                    if( subSubQuestion.question_type_name === 'MCQ') {
                        questionsCode += `\\subpart[${subSubQuestion.marks}] ${subSubQuestion.text.label}\n`+addMcqOptions(subSubQuestion)
                    } else {
                        questionsCode+=`\t\t\\subpart ${subSubQuestion.label}\n`
                    }
                })
                questionsCode+=`\\end{subparts}\n`
            }
            
        })
        questionsCode+=`\\end{parts}\n`
    }
    return questionsCode;
}
module.exports = generatePaper