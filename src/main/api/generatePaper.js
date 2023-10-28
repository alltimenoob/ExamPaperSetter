
const fs = require("fs")
const fse = require("fs-extra")

const addQuestion = (question,type) => {

  let questionsCode=""

  questionsCode += `\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}\\newline`
  question.cource_outcomes.forEach((co)=>{
    questionsCode += co.course_outcomes_number + ","
  })
  questionsCode += question.taxonomy_letter + "}}"
  
  if(question.subq.length === 0){
    
    if(question.question_type_name === "MCQ"){
        
      questionsCode += `${type}[5] ` +
      question.text.label[0] + `\\vspace{-\\baselineskip}\\vspace{2mm}` + 
      question.text.label.slice(1,question.text.label.length) + 
      `\n\\begin{oneparchoices}\\\\\n`
  
      question.mcqs.forEach((option) => {
        questionsCode += `\t\\choice ${option.option_text}\n`
      });
    
      questionsCode += `\\end{oneparchoices}\n` 

    }
    else{
      questionsCode += `${type}[${question.text.marks}] ` +
      question.text.label[0] + `\\vspace{-\\baselineskip}\\vspace{1mm}` + 
      question.text.label.slice(1,question.text.label.length) 
    }

    if(question.question_image !== null ){
      var byteString;
      if (question.question_image.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(question.question_image.split(',')[1]);
      else
          byteString = unescape(question.question_image.split(',')[1]);

      var ia = new Uint8Array(byteString.length);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const type = question.question_image.match(/[^:/]\w+(?=;|,)/)[0];
      
      fs.writeFileSync(`./input/${question.text.value}.${type}`,ia)
      questionsCode += "\\\\\n"
      questionsCode += `\\includegraphics[width=10cm,height=4cm]{${question.text.value}.${type}}`
      //🙍‍♂️

    }
  }

  questionsCode += "\n \\vspace{2mm} \n\n "
  return questionsCode;
}

const generatePaper = (args,outputPath) => {
    fse.emptyDirSync("./input/");
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
      if(question.subq.length === 0)
        questionsCode += addQuestion(question,  /* type main */ "\\question") 
      else{
        questionsCode += `\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}}}`
        questionsCode += `\\question[${question.text.marks}] ${question.text.label}`
        questionsCode += `\\vspace{1mm}`
        questionsCode += "\\begin{parts}"
        question.subq.forEach((question)=>{
          if(question.subq.length === 0)
            questionsCode += addQuestion(question,  /* type sub */ "\\part") 
          else{
            questionsCode += `\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}}}`
            questionsCode += `\\part[${question.text.marks}] ${question.text.label}`
            questionsCode += `\\vspace{1mm}`
            questionsCode += "\\begin{subparts}"
            question.subq.forEach((question)=>{
              questionsCode += addQuestion(question,  /* type sub2x */ "\\subpart") 
            })
            questionsCode += "\\end{subparts}"
          }
        })
        questionsCode += "\\end{parts}\n"
      }
  });

  questionsCode+=`\\end{questions}\n`

  if(section2.length!==0) {

      questionsCode+=`\\pagebreak\n`
      questionsCode+=`\\begin{center}\n`
      questionsCode+=`\\underline{\\textbf{SECTION-2}}\\\\\n`
      questionsCode+=`\\end{center}\n`

      questionsCode+=`\\begin{questions}\n`
      questionsCode+=`\\pointname{}\n`
      questionsCode+=`\\pointsinrightmargin\n`

      section2.forEach( question => {
        if(question.subq.length === 0)
          questionsCode += addQuestion(question,  /* type main */ "\\question") 
        else{
          questionsCode += `\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}}}`
          questionsCode += `\\question[${question.text.marks}] ${question.text.label}`
          questionsCode += `\\vspace{1mm}`
          questionsCode += "\\begin{parts}"
          question.subq.forEach((question)=>{
            if(question.subq.length === 0)
              questionsCode += addQuestion(question,  /* type sub */ "\\part") 
            else{
              questionsCode += `\\pointformat{\\parbox[t]{16pt}{\\text{[\\thepoints]}}}`
              questionsCode += `\\part[${question.text.marks}] ${question.text.label}`
              questionsCode += `\\vspace{1mm}`
              questionsCode += "\\begin{subparts}"
              question.subq.forEach((question)=>{
                questionsCode += addQuestion(question,  /* type sub2x */ "\\subpart") 
              })
              questionsCode += "\\end{subparts}"
            }
          })
          questionsCode += "\\end{parts}\n"
        }
    });

      questionsCode+=`\\end{questions}\n`
  }
  
    const examPaperCode =
      `\\documentclass[addpoints,12pt]{exam}
    \\usepackage[a4paper]{geometry}
    \\usepackage{enumitem}
    \\usepackage{amsmath,stackengine}
    \\usepackage{graphicx}
    \\usepackage{lastpage}
    
    \\geometry{
    a4paper,
    total={150mm,257mm},
    left=25mm,
    top=20mm,
    } 
    \\graphicspath{ {./input/}}
    \\cfoot{Page \\thepage\\ of \\pageref{LastPage}}

    \\begin{document}` +
      headerCode +
      questionsCode +
      `\\end{document}`;
  
    fs.writeFileSync("./input/exam_paper.tex", examPaperCode);
  
    const { exec } = require("child_process");
  
    return new Promise((resolve) => {
      exec(
        "pdflatex --output-directory=" + outputPath + " ./input/exam_paper.tex",
        (error, stdout, stderr) => {
          resolve(stdout.trim());
        }
      );
    });
  };



export default generatePaper