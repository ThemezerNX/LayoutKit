import {ipcRenderer} from "electron";

const systemChannel = (command, ...args) => ipcRenderer.invoke("system", command, ...args);
const fileSystemChannel = (command, ...args) => ipcRenderer.invoke("file-system", command, ...args);

const $ipcService = {
    system: {
        version: () => systemChannel("version"),
        openUrl: (url: string) => systemChannel("openUrl", url),
    },
    fs: {
        getUserDataPath: () => fileSystemChannel("getUserDataPath"),
        selectSingleDirectory: () => fileSystemChannel("selectSingleDirectory"),
        selectSaveLocation: (title: string, defaultPath: string, fileExtensionName: string, fileExtension: string) =>
            fileSystemChannel("selectSaveLocation", title, defaultPath, fileExtensionName, fileExtension),
        selectCfgFile: () => fileSystemChannel("selectCfgFile"),
        trash: (paths: string[]) => fileSystemChannel("trash", paths),
    },
};

export default (context: any, inject: any) => {
    inject("ipcService", $ipcService);
    context.$ipcService = $ipcService;
}
