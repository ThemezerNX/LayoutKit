import {ipcRenderer} from "electron";

const systemInfoChannel = (command, ...args) => ipcRenderer.invoke("system-info", command, ...args);
const fileSystemChannel = (command, ...args) => ipcRenderer.invoke("file-system", command, ...args);

const $ipcService = {
    system: {
        version: (...args) => systemInfoChannel("version", ...args),
    },
    fs: {
        getUserDataPath: () => fileSystemChannel("getUserDataPath"),
    },
};

export default (context: any, inject: any) => {
    inject("ipcService", $ipcService);
    context.$ipcService = $ipcService;
}
