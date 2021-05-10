import * as fs from "fs";
import * as path from "path";
import * as trash from "trash";
import {ncp} from "ncp";
import {shell} from "electron";
import * as mkdirp from "mkdirp";
import {FIRMWARE_VERSION_CFG, FIRMWARES_DIR, getDirectories, getFiles} from "./managerUtils";
import {isTarget} from "@themezernx/target-parser/dist";

export default (context: any, inject: any) => {
    const $firmwareManager = {
        refresh() {
            context.store.commit("FIRMWARES_LOADING", true);
            setTimeout(() => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const firmwaresPath = path.join(userDataPath, FIRMWARES_DIR);
                    mkdirp(firmwaresPath).then(() => {
                        const firmwares = getDirectories(firmwaresPath).sort();
                        context.store.commit("FIRMWARES_LOADING", false);
                        context.store.commit("FIRMWARES", firmwares);
                    });
                });
            }, 500);
        },
        firmwareFiles(version) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                        const firmwarePath = path.join(userDataPath, FIRMWARES_DIR, version);
                        const files = getFiles(firmwarePath);
                        const usableFiles = files.filter((f) => isTarget(f));
                        resolve(usableFiles);
                    });
                }, 500);
            });
        },
        import(directory) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    fs.readFile(path.join(directory, FIRMWARE_VERSION_CFG), "utf8", (err, versionString) => {
                        if (err) return console.error(err);

                        const newDirectory = path.join(userDataPath, FIRMWARES_DIR, versionString);
                        ncp(directory, newDirectory, () => {
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
