import {ipcRenderer} from "electron";

const systemInfoChannel = (command, ...args) => ipcRenderer.invoke("system-info", command, ...args);
const fileSystemChannel = (command, ...args) => ipcRenderer.invoke("file-system", command, ...args);

const $ipcService = {
    system: {
        version: () => systemInfoChannel("version"),
        openUrl: (...args) => systemInfoChannel("openUrl", ...args),
    },
    fs: {
        getUserDataPath: () => fileSystemChannel("getUserDataPath"),
        selectSingleDirectory: () => fileSystemChannel("selectSingleDirectory"),
        selectCfgFile: () => fileSystemChannel("selectCfgFile"),
    },
};

export default (context: any, inject: any) => {
    inject("ipcService", $ipcService);
    context.$ipcService = $ipcService;
}