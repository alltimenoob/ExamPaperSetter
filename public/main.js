const { app, BrowserWindow, ipcMain ,dialog } = require('electron'); // electron
const isDev = require('electron-is-dev'); // To check if electron is in development mode
const path = require('path');
const fs = require('fs')
const sqlite= require('sqlite3');

let mainWindow,CourseWindow;

const getMetadata=()=>{
  
  const metadataPath=path.join(app.getAppPath(),'./metadata.json')

  console.log(fs.existsSync(metadataPath))
  if(fs.existsSync(metadataPath)===false)
    return {takenTour:false};

    const jsonString=fs.readFileSync(metadataPath,'utf8')
    const metadata=JSON.parse(jsonString)

    return metadata;
}

// Initializing the Electron Window
const createWindow = () => {
  let metadata=getMetadata();
  console.log(metadata)
  const windowParameters = {
    width: metadata.isTourTaken ? 800 : 500 , 
    height: metadata.isTourTaken ? 600 : 300,
    frame:false,
    webPreferences: {
      preload: isDev 
        ? path.join(app.getAppPath(), './public/preload.js')
        : path.join(app.getAppPath(), './build/preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true, 
    }
  }

  mainWindow = new BrowserWindow(windowParameters);

	
  mainWindow.loadURL(
    isDev
      ? metadata.isTourTaken ? 'http://localhost:3000/' : 'http://localhost:3000/WelcomeTour'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
	
  //mainWindow.setIcon(path.join(__dirname, 'images/appicon.ico'));

  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      //mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  }
};

// ((OPTIONAL)) Setting the location for the userdata folder created by an Electron app. It default to the AppData folder if you don't set it.
app.setPath(
  'userData',
  isDev
    ? path.join(process.resourcesPath/*app.getAppPath()*/, 'userdata/') // In development it creates the userdata folder where package.json is
    : path.join(process.resourcesPath, 'userdata/') // In production it creates userdata folder in the resources folder
);

// When the app is ready to load
app.whenReady().then(async () => {
  await createWindow(); // Create the mainWindow
});

// Exiting the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activating the app
app.on('activate', () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//Database Connection And Instance
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

// Function To Minimize Window
ipcMain.handle("minimize",()=>{
    mainWindow.minimize()
})

// Function To Maximize Window
ipcMain.handle("maximize",()=>{
    if(mainWindow.isMaximized())
    {
        mainWindow.unmaximize()
    }
    else
    {
        mainWindow.maximize()
    }
})

ipcMain.handle("showDialog",(event,args)=>{
  let win = null;
  switch(args.window)
  {
    case "mainWindow" :
        win = mainWindow
        break;
    case "CourseWindow":
        win = CourseWindow
        break;
    default:
        break;
  }

  dialog.showMessageBox(win, args.options);
})
  

// Function To Close Window
ipcMain.handle("close",(event,args)=>{
    switch(args)
    {
      case "mainWindow" :
          app.quit();
          break;
      case "CourseWindow":
          mainWindow.webContents.reloadIgnoringCache()
          CourseWindow.close()
          break;
      default:
          break;
    }
})


ipcMain.handle("createCourse",(event,args)=>{
  // insertCourseQuery to Insert Courese details into database 
  const insertCourseQuery='INSERT INTO course(course_code,course_name) VALUES(?,?)';

  let course_id;
  new Promise((resolve,reject)=>{
    database.run(insertCourseQuery,[args.code,args.name],
    function (error){
      if(error)
      {
        return reject(-1);
      }

      return resolve(this.lastID);
    }
      )
    }).then((result) => {
      course_id=result;

    //insertCoQuery to insert Co details into database
      const insertCoQuery='INSERT INTO course_outcomes(course_outcomes_number,course_outcomes_description,course_id) VALUES(?,?,?)';
      const cos=args.co.map((value)=>value.value);
     
      cos.forEach((co,index)=>{
        database.run(insertCoQuery,[index+1,co,course_id],(error)=>{
          if(error)
          {
            console.log(error);
          }
          
        })
      });
      

    //insertUnit to insert Unit details into database
      const insertUnitQuery='INSERT INTO unit(unit_name,course_id) VALUES(?,?)';

      args.unit.forEach((value)=>{
        database.run(insertUnitQuery,[value.value,course_id],(error)=>{
          if(error)
          {
            console.log(error);
          }
          
      })
      });
    });
  return true
})

ipcMain.handle("getCourses",async ()=>{
//function returns JSON Object which contains list of courses
  const courses=[];
  
  const retriveQuery='SELECT * from course';

  return new Promise((resolve,reject)=>{
    
    database.each(retriveQuery,
      (error, row) => {
          
        if(error!=null)
            reject({statusCode:0,errorMessage:error});

        courses.push({"id":row.course_id,"code":row.course_code,"name":row.course_name});
        resolve({statusCode:1,courses:courses});
        })
    })

})

// Opens Update Course Window On Edit Button Of Course
ipcMain.handle("updateCourseWindow",(events,args)=>{

  CourseWindow = new BrowserWindow({
     parent: mainWindow,
     modal:true,
     height: 400,
     width: 600,
     frame:false,
     webPreferences: {
       preload: isDev 
         ? path.join(app.getAppPath(), './public/preload.js')
         : path.join(app.getAppPath(), './build/preload.js'),
       worldSafeExecuteJavaScript: true,
       contextIsolation: true, 
     },
   });
   CourseWindow.setResizable(false)
   
   CourseWindow.loadURL( isDev
     ? `http://localhost:3000/updateCourse/?course_name=${args.name}&course_id=${args.id}&course_code=${args.code}`
     : `file://${path.join(__dirname, '../build/index.html')}` );
})


//Remove course from database
ipcMain.handle("removeCourse",async(event,args)=>{

  let status;
  const removeCourseQuery="DELETE FROM course WHERE course_id=?";
    new Promise((resolve,reject)=>
    {
      database.run(removeCourseQuery,[args],(error)=>{
        if(error!=null)
        {
          console.log(error);
          reject(false);
        }
        console.log('couse with course_id '+args+' removed succesfully');
        resolve(true);
      })
    }).then(
    function(res)
    {
      status=res;
    }
  );

  return status;
});

// Update Course function
ipcMain.handle("updateCourse",async(event,args)=>{

  const course_id=args.CourseID;
  const course_name=args.CourseName;
  const course_code=args.CourseCode;
  //update Query to updatecourse details
  const updateCourseQuery='UPDATE course SET course_code=? , course_name=? WHERE course_id=?'

  const status=new Promise((resolve,reject)=>{

    database.run(updateCourseQuery,[course_code,course_name,course_id],(error)=>{
      if(error)
      {
        console.log(error);
        reject(false);
      }
      console.log('course with course_id '+course_id+' updated successfully')
      resolve(true)
    })
  })
    return status;
});



ipcMain.handle('setCollegeMetaData',(event,args)=>{

  if(args==null) return false;
    args=JSON.stringify(args)
    // console.log(args)
    fs.writeFileSync(path.join(app.getAppPath(),'./metadata.json'),args);
})

ipcMain.handle("openNewCourse",()=>{

   CourseWindow = new BrowserWindow({
      parent: mainWindow,
      modal:true,
      height: 400,
      width: 600,
      frame:false,
      webPreferences: {
        preload: isDev 
          ? path.join(app.getAppPath(), './public/preload.js')
          : path.join(app.getAppPath(), './build/preload.js'),
        worldSafeExecuteJavaScript: true,
        contextIsolation: true, 
      },
    });

    CourseWindow.loadURL( isDev
      ? 'http://localhost:3000/createCourse'
      : `file://${path.join(__dirname, '../build/index.html')}` );
})