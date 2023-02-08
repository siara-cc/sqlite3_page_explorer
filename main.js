const {
  app,
  BrowserWindow,
  ipcMain
} = require("electron");
const path = require("path");
const fs = require("fs");
const process = require('process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  // Load app
  win.loadFile(path.join(__dirname, "index.html"));

  // rest of code..
}

app.on("ready", createWindow);

var myBinaryFileFD = 0;
ipcMain.on("toMain", (event, args) => {
  switch (args.cmd) {
    case "getProcArgs":
      event.returnValue = process.argv;
      break;
    case "openFile":
      var ret = true;
      try {
          if (myBinaryFileFD != 0)
            fs.closeSync(myBinaryFileFD);
          myBinaryFileFD = fs.openSync(args.path, "r");
      } catch (e) {
        console.log("Error opening file" + e);
        ret = false;
      }
      event.returnValue = ret;
      break;
    case "openDialog":
      const { dialog } = require('electron')
      result = dialog.showOpenDialogSync({ properties: ['openFile'] });
      //win.webContents.send("toMainSync", {cmd: args.cmd, fileNames: result});
      try {
          if (myBinaryFileFD != 0)
            fs.closeSync(myBinaryFileFD);
          myBinaryFileFD = fs.openSync(result[0], "r");
      } catch (e) {
        console.log("Error opening file" + e);
      }
      event.returnValue = {cmd: args.cmd, fileNames: result};
      break;
    case "readFile":
      var pos = args.fromPos;
      var byteCount = args.byteCount;
      var buffer = new Uint8Array(byteCount);
      try {
        var bytesRead = fs.readSync(myBinaryFileFD, buffer, 0, byteCount, pos);
        if (bytesRead < byteCount)
          console.log("Could not read data as expected");
      } catch (e) {
        console.log("Error opening file" + e);
      }
      //win.webContents.send("fromMain", {cmd: args.cmd, bytesRead: buffer});
      event.returnValue = {cmd: args.cmd, bytesRead: buffer};
      break;
  }
});
