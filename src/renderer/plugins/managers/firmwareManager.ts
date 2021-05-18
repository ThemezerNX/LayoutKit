import * as fs from "fs";
import * as path from "path";
import {ncp} from "ncp";
import {shell} from "electron";
import * as mkdirp from "mkdirp";
import {FIRMWARES_DIR, getDirectories, getFiles, VERSION_CFG} from "./managerUtils";
import {isTarget} from "@themezernx/target-parser/dist";

export default (context: any, inject: any) => {
    const $firmwareManager = {
        refresh() {
            return new Promise((resolve) => {
                context.store.commit("FIRMWARES_LOADING", true);
                setTimeout(() => {
                    context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                        const firmwaresPath = path.join(userDataPath, FIRMWARES_DIR);
                        mkdirp(firmwaresPath).then(() => {
                            const firmwares = getDirectories(firmwaresPath).sort(
                                (a, b) =>
                                    b.localeCompare(a, "en", {"sensitivity": "base"}),
                            );
                            context.store.commit("FIRMWARES_LOADING", false);
                            context.store.commit("FIRMWARES", firmwares);
                            resolve(null);
                        });
                    });
                }, 300);
            });
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
                }, 300);
            });
        },
        import(directory) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    fs.readFile(path.join(directory, VERSION_CFG), "utf8", (err, versionString) => {
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
                shell.openPath(path.join(userDataPath, FIRMWARES_DIR, version)).then();
            });
        },
        delete(version: string) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then(async (userDataPath) => {
                    await context.$ipcService.fs.trash([path.join(userDataPath, FIRMWARES_DIR, version)]);
                    resolve(null);
                    await this.refresh();
                });
            });
        },
    };

    inject("firmwareManager", $firmwareManager);
    context.$firmwareManager = $firmwareManager;
}
