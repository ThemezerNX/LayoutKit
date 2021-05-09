// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {app, dialog} from "electron";

export default class SystemInfoChannel extends IpcChannel {
    NAME = "file-system";

    constructor() {
        super({
            getUserDataPath: () => app.getPath("userData"),
            selectSingleDirectory: () => dialog.showOpenDialogSync({properties: ["openDirectory"]}),
            selectCfgFile: () => dialog.showOpenDialogSync({
                properties: ["openFile"],
                filters: [{name: "ver.cfg", extensions: ["cfg"]}],
            }),
        });
    }

}
