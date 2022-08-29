const sqlite= require('sqlite3');
const path = require('path');
const { app } = require('electron'); // electron

const isDev=true;

const database = new sqlite.Database(
    isDev
        ? path.join(path.join(app.getAppPath(),"database/database.sqlite"))
        : path.join(process.resourcesPath,"database/qwesda"),
    (err) => {
        if(err)
            console.log("Database Error");
        else
            console.log("Database Loaded");
    }
);

 const data={};
const retriveQuery='SELECT * from course';
database.each(retriveQuery,
 (error, row) => {
    if(error!=null)
    {
      return {statusCode:0,errorMessage:error};
    }
    data[row.course_code]=row.course_name;
  }
);

  console.log({statusCode:1,data:data});
