
const deleteQuestion = (args,database)=>{

    return new Promise((resolve,reject)=>{

        database.run("DELETE FROM question WHERE question_id = ?",[args],(error)=>{
            if(error!=null)
                reject(false)
            resolve(true)
        });
    })

};

export default deleteQuestion;