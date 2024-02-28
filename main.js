const {
  app,
  BrowserWindow,
} = require("electron");
const path = require("path");
const process = require('process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
    }
  });

  // Load app
  win.loadFile(path.join(__dirname, "index.html"));

  win.webContents.on("did-finish-load", () => {
    if (process.argv.length > 2) {
      setFileInput(win.webContents, "input[type=file]", [process.argv[2]]);
    }
  });
}

app.on("ready", createWindow);

// https://github.com/electron/electron/issues/749
async function setFileInput(wc, selector, files) {
  try {
    wc.debugger.attach("1.1");
    const { root } = await wc.debugger.sendCommand("DOM.getDocument", {});
    const { nodeId } = await wc.debugger.sendCommand("DOM.querySelector", { nodeId: root.nodeId, selector });
    await wc.debugger.sendCommand("DOM.setFileInputFiles", { nodeId, files });
  } finally {
    wc.debugger.detach();
  }
}
