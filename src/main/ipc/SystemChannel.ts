// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {execSync} from "child_process";
import {shell} from "electron";

export default class SystemChannel extends IpcChannel {
    NAME = "system";

    constructor() {
        super({
            version: (): string => execSync("uname -a").toString(),
            openUrl(url: string) {
                shell.openExternal(url).then();
            },
        });
    }

}