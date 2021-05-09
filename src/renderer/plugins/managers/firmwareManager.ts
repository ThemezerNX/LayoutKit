import * as fs from "fs";
import * as path from "path";
import * as trash from "trash";
import {ncp} from "ncp";
import {shell} from "electron";
import * as mkdirp from "mkdirp";
import {FIRMWARES_DIR, getDirectories} from "./managerUtils";

export default (context: any, inject: any) => {
    const $firmwareManager = {
        refresh() {
            context.store.commit("FIRMWARES_LOADING", true);
            setTimeout(() => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const firmwaresPath = path.join(userDataPath, FIRMWARES_DIR);
                    mkdirp(firmwaresPath).then(() => {
                        const firmwares = getDirectories(firmwaresPath);
                        context.store.commit("FIRMWARES_LOADING", false);
                        context.store.commit("FIRMWARES", firmwares);
                    });
                });
            }, 500);
        },
        import(directory, version) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const newDirectory = path.join(userDataPath, FIRMWARES_DIR, version);
                    console.log(directory, newDirectory);
                    ncp(directory, newDirectory, {
                        filter: (source) => fs.lstatSync(source).isDirectory() || (/.*szs/i).test(source),
                    }, () => {
                        try {
                            this.refresh();
                            resolve(null);
                        } catch (e) {
                            context.$popup.error(e);
                            resolve(null);
                        }
                    });
                });
            });
        },
        openInExplorer(version: string) {
            context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                shell.openPath(path.join(userDataPath, FIRMWARES_DIR, version));
            });
        },
        delete(version: string) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    resolve(trash(path.join(userDataPath, FIRMWARES_DIR, version)).then(this.refresh));
                });
            });
        },
    };

    inject("firmwareManager", $firmwareManager);
    context.$firmwareManager = $firmwareManager;
}
