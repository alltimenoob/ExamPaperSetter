const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {

  minimize: () => ipcRenderer.invoke('minimize'), // Minimize The Window

  maximize: () => ipcRenderer.invoke('maximize'), // Maximize The Window

  close: (args) => ipcRenderer.invoke('close',args), // Close The Window

  goBack : () => ipcRenderer.invoke('goBack') , // Navigates To Previous Page

  openNewCourse : () => ipcRenderer.invoke('openNewCourse'), // Open New Course Window

  openCourse : (args) => ipcRenderer.invoke('openCourse',args), // Open New Course Window

  openAddQuestions : (args) => ipcRenderer.invoke('openAddQuestions',args), // Open New Course Window

  updateCourseWindow : (args) => ipcRenderer.invoke('updateCourseWindow',args), // Update Course Window

  updateCourse : (args) => ipcRenderer.invoke('updateCourse',args), // Update Course

  removeCourse : (args) => ipcRenderer.invoke('removeCourse',args), // Remove Course

  createCourse : args => ipcRenderer.invoke('createCourse', args), // Database Call For Create Course

  getCourses : () => ipcRenderer.invoke('getCourses'),

  getUnits : (args) => ipcRenderer.invoke('getUnits',args), //get Units by course id
  
  getCOs : (args) => ipcRenderer.invoke('getCOs',args), //get Course Outcomes by course id

  getQuestionTypes : () => ipcRenderer.invoke('getQuestionTypes'), //get Question types

  getTaxonomy : () => ipcRenderer.invoke('getTaxonomy'), //get Taxonomy 

  getCourseFromID : (args) => ipcRenderer.invoke('getCourseFromID',args),

  setCollegeMetaData : (args) => ipcRenderer.invoke('setCollegeMetaData',args),

  showDialog : args => ipcRenderer.invoke('showDialog',args),

  testSend: (args) => ipcRenderer.send('test-send', args),//Example Send

  testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) }) // Example Receive
});

