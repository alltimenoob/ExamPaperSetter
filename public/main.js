const { data } = require('autoprefixer');
const { parseJson } = require('builder-util-runtime');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron'); // electron
const isDev = require('electron-is-dev'); // To check if electron is in development mode
const { resolve } = require('path');
const path = require('path');
const sqlite= require('sqlite3');

let mainWindow,NewCourseWindow;

// Initializing the Electron Window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    frame:false,
    webPreferences: {
      preload: isDev 
        ? path.join(app.getAppPath(), './public/preload.js')
        : path.join(app.getAppPath(), './build/preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true, 
    },
  });

	
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
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
    ? path.join(app.getAppPath(), 'userdata/') // In development it creates the userdata folder where package.json is
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

// Function To Close Window
ipcMain.handle("close",(event,args)=>{
    switch(args)
    {
      case "mainWindow" :
          app.quit();
          break;
      case "NewCourseWindow":
          NewCourseWindow.close()
          break;
      default:
          break;
    }
})


ipcMain.handle("createCourse",(event,args)=>{
  
  console.log(args.course_code);
  let isDataInserted=true;
  //Insert Query for insert course details in course table
  const insertQuery='INSERT INTO course(course_name,course_code) VALUES(?,?)';
  database.run(insertQuery,[args.course_name,args.course_code],(error)=>{ if(error!=null) isDataInserted =false})
  return isDataInserted;
})

ipcMain.handle("getCourses",async (event,args)=>{
//function returns JSON Object which contains list of courses
var statusCode=0;
const courses={};
const retriveQuery='SELECT * from course';
return new Promise((resolve,reject)=>{
    database.each(retriveQuery,
    (error, row) => {
        if(error!=null)
        {
          return reject({statusCode:0,errorMessage:error} );
        }
        courses[row.course_code]=row.course_name;
        resolve({statusCode:1,coursrs:courses});
        }
      )
  })
})




ipcMain.handle("openNewCourse",()=>{


   NewCourseWindow = new BrowserWindow({
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

    NewCourseWindow.loadURL( isDev
      ? 'http://localhost:3000/createCourse'
      : `file://${path.join(__dirname, '../build/index.html')}` );
})