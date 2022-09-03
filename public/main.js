const { app, BrowserWindow, ipcMain,dialog } = require('electron'); // electron
const isDev = require('electron-is-dev'); // To check if electron is in development mode
const path = require('path');
const fs = require('fs')
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
    case "NewCourseWindow":
        win = NewCourseWindow
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
      case "NewCourseWindow":
          NewCourseWindow.close()
          break;
      default:
          break;
    }
})


ipcMain.handle("createCourse",(event,args)=>{
  console.log(args)
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

        courses.push({"code":row.course_code,"name":row.course_name});
        resolve({statusCode:1,courses:courses});
        })
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