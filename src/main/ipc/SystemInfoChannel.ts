// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {execSync} from "child_process";
import {shell} from "electron";

export default class SystemInfoChannel extends IpcChannel {
    NAME = "system-info";

    constructor() {
        super({
            version(): string {
                return execSync("uname -a").toString();
            },
            openUrl(url: string) {
                shell.openExternal(url).then();
            },
        });
    }

}
