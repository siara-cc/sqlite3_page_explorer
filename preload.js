const {
    contextBridge,
    ipcRenderer,
    ipcMain
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        receive: (channel, fun1) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => fun1(...args));
            }
        },
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        sendSync: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.sendSync(channel, data);
            }
        },
        setupSyncReceive: () => {
            ipcRenderer.on('toMainSync', (event, arg) => {
                event.returnValue = arg;
            });
            return "success";
        }
    }
);
