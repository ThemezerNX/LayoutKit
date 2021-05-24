import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";
import temp from "temp";
import {ncp} from "ncp";
import {shell} from "electron";
import {FIRMWARES_DIR, getDirectories, getFiles, VERSION_CFG} from "./managerUtils";
import {isTarget} from "@themezernx/target-parser/dist";
import log from "electron-log";

const firmwareLog = log.scope("firmwareManager");

temp.track();

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
                }, 100);
            });
        },
        firmwareFiles(version) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const firmwarePath = path.join(userDataPath, FIRMWARES_DIR, version);
                    const files = getFiles(firmwarePath);
                    const usableFiles = files.filter((f) => isTarget(f));
                    resolve(usableFiles);
                });
            });
        },
        import(directory) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    fs.readFile(path.join(directory, VERSION_CFG), "utf8", (err, versionString) => {
                        if (err) return firmwareLog.error("[firmwareManager]", err);

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
            return new Promise((resolve, reject) => {
                const usedIn = context.store.state.projects
                    .filter((p) => p.firmware === version)
                    .map((p) => p.name);
                if (usedIn.length > 0) {
                    // Firmware in use
                    reject(`This firmware is still in use by ${usedIn.join(", ")}. You have to remove those first, before you may delete firmware ${version}.`);
                } else {
                    context.$ipcService.fs.getUserDataPath().then(async (userDataPath) => {
                        await context.$ipcService.fs.trash([path.join(userDataPath, FIRMWARES_DIR, version)]);
                        resolve(null);
                        await this.refresh();
                    });
                }
            });
        },
        async openFirmwareFolderInToolbox(version) {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const firmwarePath = path.join(userDataPath, FIRMWARES_DIR, version);
            const dirPath = temp.mkdirSync("layoutkit");
            return new Promise((resolve) => {
                ncp(firmwarePath, dirPath, {
                    filter: (filePath) =>
                        fs.lstatSync(filePath).isDirectory() ||
                        isTarget(path.basename(filePath)),
                }, () => {
                    for (const file of getFiles(dirPath)) {
                        const filePath = path.join(dirPath, file);
                        const fileName = path.basename(filePath);
                        // This will match the first occurrence. In the case the dir has a same name, this will fail.
                        // Very unlikely!
                        fs.renameSync(filePath, filePath.replace(fileName, `${version}-${fileName}`));
                    }
                    context.$toolManager.toolbox.openFolder(dirPath).then(resolve);
                });
            });
        },
    };

    inject("firmwareManager", $firmwareManager);
    context.$firmwareManager = $firmwareManager;
}
