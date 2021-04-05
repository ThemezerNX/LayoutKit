// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {execSync} from "child_process";

export default class SystemInfoChannel extends IpcChannel {
    NAME = "system-info";

    constructor() {
        super({
            version(...args: any[]): string {
                return execSync("uname -a").toString();
            },
        });
    }

}
