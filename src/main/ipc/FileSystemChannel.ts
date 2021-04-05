// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {app} from "electron";

export default class SystemInfoChannel extends IpcChannel {
    NAME = "file-system";

    constructor() {
        super({
            getUserDataPath() {
                return app.getPath("userData");
            },
        });
    }

}
