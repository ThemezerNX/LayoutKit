// @ts-ignore
import IpcChannel from "./IpcChannel.ts";
import {execSync} from "child_process";
import {app, shell} from "electron";
import {autoUpdater} from "electron-updater";

export default class SystemChannel extends IpcChannel {
    NAME = "system";

    constructor() {
        super({
            version: (): string => app.getVersion(),
            openUrl(url: string) {
                shell.openExternal(url).then();
            },
            quitAndInstallUpdate() {
                autoUpdater.quitAndInstall();
            },
        });
    }

}
