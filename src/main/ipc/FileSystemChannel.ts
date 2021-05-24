// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {app, dialog, shell} from "electron";
// import * as util from "util";
// import {unzip} from "cross-unzip";

export default class SystemInfoChannel extends IpcChannel {
    NAME = "file-system";

    constructor() {
        super({
            getUserDataPath: () => app.getPath("userData"),
            selectSingleDirectory: () => dialog.showOpenDialogSync({properties: ["openDirectory"]}),
            selectSaveLocation: (title: string, defaultPath: string, fileExtensionName: string, fileExtension: string) => dialog.showSaveDialogSync({
                title,
                defaultPath,
                filters: [{name: fileExtensionName, extensions: [fileExtension]}],
            }),
            selectCfgFile: () => dialog.showOpenDialogSync({
                properties: ["openFile"],
                filters: [{name: "ver.cfg", extensions: ["cfg"]}],
            }),
            selectLayoutFile: () => dialog.showOpenDialogSync({
                properties: ["openFile"],
                filters: [{name: "Layout JSON", extensions: ["json"]}],
            }),
            trash: async (paths: string[]) => {
                for (const path of paths) {
                    try {
                        await shell.trashItem(path);
                    } catch (_e) {
                    }
                }
            },
        });
    }

}
