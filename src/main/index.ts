import {app, ipcMain} from "electron";
// @ts-ignore
import SystemInfoChannel from "./ipc/SystemInfoChannel.ts";
// @ts-ignore
import FileSystemChannel from "./ipc/FileSystemChannel.ts";
// @ts-ignore
import IpcChannel from "./ipc/IpcChannel.ts";

const registerIpcChannels = (ipcChannels: IpcChannel[]) => {
    ipcChannels.forEach(channel => ipcMain.handle(channel.getName(), channel.handle));
};

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

// We will also create our IPC channels for communication with the renderer
registerIpcChannels([
    new SystemInfoChannel(),
    new FileSystemChannel(),
]);

// Load here all startup windows

// @ts-ignore
import("./mainWindow.ts");