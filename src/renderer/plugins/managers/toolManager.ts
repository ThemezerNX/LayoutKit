import * as fs from "fs";
import * as path from "path";
import {
    FIRMWARES_DIR,
    getFiles,
    LAYOUTEDITOR_DIR,
    PROJECTS_DIR,
    SARCTOOL_DIR,
    SARCTOOL_EXE,
    THEMEINJECTOR_DIR,
    THEMEINJECTOR_EXE,
    TOOLBOX_DIR,
    TOOLBOX_EXE,
    TOOLS_DIR,
    VERSION_CFG,
} from "./managerUtils";
import axios from "axios";
import Downloader from "nodejs-file-downloader";
import editJsonFile from "edit-json-file";
import {execFile, spawn} from "child_process";
// 'spawn' if the program stays open, 'execFile' if it exits automatically
import {toNice} from "@themezernx/target-parser/dist";
import log from "electron-log";
import * as sevenBin from "7zip-bin";
import {extractFull} from "node-7z";

const toolLog = log.scope("toolManager");
const pathTo7zip = sevenBin.path7za.replace("app.asar", "app.asar.unpacked"); // fix asar issues

const UPDATE_MESSAGE_TIMEOUT = 300;

export default (context: any, inject: any) => {
    const setUpdateMessage = (message: string) => {
        toolLog.info(message);
        context.store.commit("CHECKING_FOR_TOOL_UPDATES_MESSAGE", message);
    };
    const fetchLatestAsset = (toolDir, toolName, {
        url,
        expectedMimeType,
        assetNameContains,
        directUrl,
        directVersion,
    }) => {
        return new Promise((resolve) => {
            toolLog.info(`[${toolName}] Checking for updates...`);
            fs.readFile(path.join(toolDir, VERSION_CFG), "utf8", async (err, versionString) => {
                let currentVersion = versionString;
                if (err) currentVersion = String(0);

                try {
                    let asset = {
                        url: null,
                        version: null,
                        name: null,
                    };

                    if (url) {
                        // GitHub
                        const res = await axios.get(url);
                        const releases = res.data;
                        if (releases?.length > 0) {
                            const githubAsset = res.data[0]["assets"].find((a) =>
                                a.content_type === expectedMimeType &&
                                assetNameContains ? a.name.includes(assetNameContains) : true,
                            );
                            asset.url = githubAsset?.browser_download_url;
                            const updatedAt = githubAsset?.updated_at;
                            asset.name = githubAsset?.name;
                            asset.version = new Date(updatedAt).getTime().toString();
                        } else {
                            toolLog.warn(`[${toolName}] No releases found`);
                            resolve(null);
                        }
                    } else if (directUrl) {
                        // Direct link
                        asset.url = directUrl;
                        asset.name = path.basename(directUrl);
                        asset.version = directVersion;
                    }

                    if (asset.url && currentVersion < asset.version) {
                        setUpdateMessage(`[${toolName}] Downloading update...`);
                        setTimeout(async () => {
                            const downloader = new Downloader({
                                url: asset.url,
                                directory: toolDir,
                                cloneFiles: false,
                            });

                            const zipPath = path.join(toolDir, asset.name);
                            try {
                                await downloader.download();
                                setUpdateMessage(`[${toolName}] Download done, unpacking...`);
                                const unzip = extractFull(zipPath, toolDir, {
                                    $bin: pathTo7zip,
                                });

                                const unzipPromise = new Promise((resolve, reject) => {
                                    unzip.on("end", resolve);
                                    unzip.on("error", reject);
                                });

                                await unzipPromise;

                                // Save version
                                fs.writeFileSync(path.join(toolDir, VERSION_CFG), asset.version);

                                setUpdateMessage(`[${toolName}] Update completed!`);
                                setTimeout(() => {
                                    resolve(null);
                                }, UPDATE_MESSAGE_TIMEOUT);
                            } catch (e) {
                                toolLog.error(e);
                                setUpdateMessage(`[${toolName}] Download failed!`);
                                setTimeout(() => {
                                    resolve(null);
                                }, UPDATE_MESSAGE_TIMEOUT + 200);
                            } finally {
                                // Finally trash downloaded archive
                                await context.$ipcService.fs.trash([zipPath]);
                            }
                        }, UPDATE_MESSAGE_TIMEOUT);
                    } else {
                        toolLog.info(`[${toolName}] No update found`);
                        resolve(null);
                    }
                } catch (e) {
                    toolLog.error(e);
                    setUpdateMessage(`[${toolName}] Could not check for updates`);
                    setTimeout(() => {
                        resolve(null);
                    }, UPDATE_MESSAGE_TIMEOUT);
                }
            });
        });
    };

    const $toolManager = {
        async updateSarcTool() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, SARCTOOL_DIR);
            const url = "https://api.github.com/repos/aboood40091/SARC-Tool/releases";

            await fetchLatestAsset(
                directory,
                SARCTOOL_DIR,
                {
                    url,
                    expectedMimeType: "application/x-zip-compressed",
                    assetNameContains: null,
                    directUrl: null,
                    directVersion: null,
                },
            );
        },
        async updateThemeInjector() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, THEMEINJECTOR_DIR);
            // const url = "https://api.github.com/repos/exelix11/SwitchThemeInjector/releases";
            // await fetchLatestAsset(
            //     directory,
            //     SWITCHTHEMEINJECTOR_DIR,
            //     {
            //         url,
            //         expectedMimeType: "application/octet-stream",
            //         assetNameContains: ".7z",
            //         directUrl: null,
            //     },
            // );

            const directUrl = "https://github.com/ThemezerNX/LayoutKit/releases/download/beta-0.0.2/SwitchThemeInjector-Release4.6.2-pre.7z";
            await fetchLatestAsset(
                directory,
                THEMEINJECTOR_DIR,
                {
                    url: null,
                    expectedMimeType: null,
                    assetNameContains: null,
                    directUrl,
                    directVersion: "4.6.1",
                },
            );
        },
        async updateToolbox() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, TOOLBOX_DIR);
            const url = "https://api.github.com/repos/KillzXGaming/Switch-Toolbox/releases";

            await fetchLatestAsset(
                directory,
                TOOLBOX_DIR,
                {
                    url,
                    expectedMimeType: "application/octet-stream",
                    assetNameContains: null,
                    directUrl: null,
                    directVersion: null,
                },
            );
        },
        async updateLayoutEditor() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, LAYOUTEDITOR_DIR);
            const url = "https://api.github.com/repos/FuryBaguette/SwitchLayoutEditor/releases";

            await fetchLatestAsset(
                directory,
                LAYOUTEDITOR_DIR,
                {
                    url,
                    expectedMimeType: "application/x-zip-compressed",
                    assetNameContains: null,
                    directUrl: null,
                    directVersion: null,
                },
            );
        },
        async updateAllTools() {
            // await $toolManager.updateSarcTool();
            await $toolManager.updateThemeInjector();
            await $toolManager.updateToolbox();
            // await $toolManager.updateLayoutEditor();
            context.store.commit("CHECKING_FOR_TOOL_UPDATES_MESSAGE", "");
        },
        szs: {
            unpack(filePath) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const sarcToolPath = path.join(userDataPath, TOOLS_DIR, SARCTOOL_DIR, SARCTOOL_EXE);
                    // Unpack the szs next to the original file
                    execFile(sarcToolPath, [filePath], () => {
                        resolve(null);
                    });
                });
            },
            pack(originDir, destFile) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const sarcToolPath = path.join(userDataPath, TOOLS_DIR, SARCTOOL_DIR, SARCTOOL_EXE);
                    // Unpack the szs next to the original file
                    execFile(sarcToolPath, ["-little", "-compress", "0", "-o", destFile, originDir], () => {
                        resolve(null);
                    });
                });
            },
        },
        toolbox: {
            open() {
                return this.openPaths([]); // quick solution
            },
            openPaths(paths: Array<string>) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const toolboxPath = path.join(userDataPath, TOOLS_DIR, TOOLBOX_DIR, TOOLBOX_EXE);
                    const ls = spawn(toolboxPath, paths);
                    ls.stdout.on("data", () => {
                        setTimeout(() => {
                            resolve(null);
                        }, 500);
                    });
                });
            },
            async openFolder(dirPath) {
                const filePaths = getFiles(dirPath)
                    .map((f) => path.join(dirPath, f));
                await this.openPaths(filePaths);
            },
            async openProjectFiles(projectId: string, files: Array<string>) {
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const filePaths = files.map((f) => path.join(userDataPath, PROJECTS_DIR, projectId, f));
                await this.openPaths(filePaths);
            },
            async openProjectFolder(projectId) {
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const projectPath = path.join(userDataPath, PROJECTS_DIR, projectId);
                await this.openFolder(projectPath);
            },
        },
        layoutinjector: {
            createLayoutJson(projectId: string, fileName: string) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const layoutinjectorPath = path.join(userDataPath, TOOLS_DIR, THEMEINJECTOR_DIR, THEMEINJECTOR_EXE);

                    const stockPath = path.join(userDataPath, FIRMWARES_DIR, context.store.state.activeProject.firmware, fileName);
                    const filePath = path.join(userDataPath, PROJECTS_DIR, projectId, fileName);
                    const newFileName = `${context.store.state.activeProject.name}-${toNice(fileName)}.json`;
                    // Unpack the szs next to the original file
                    try {
                        const savePath = await context.$ipcService.fs.selectSaveLocation("Select save location for layout", newFileName, "Layout JSON", "json");
                        if (savePath?.length > 0) {
                            execFile(layoutinjectorPath, ["diff", stockPath, filePath, savePath], (_err, stdout, stderr) => {
                                // ^ diff <original szs file> <modified szs file> <output json path>
                                if (stdout) toolLog.info(stdout);
                                if (stderr?.trim().length > 0) {
                                    toolLog.error(stderr);
                                    context.$popup.error(new Error(stderr.trim()));
                                } else {
                                    // Prettify the json
                                    const json = editJsonFile(savePath, {stringify_width: 4});
                                    json.save();
                                }
                                resolve(null);
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        toolLog.error(e);
                        resolve(null);
                    }
                });
            },
            applyLayoutJson(projectId: string, fileName: string) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const layoutinjectorPath = path.join(userDataPath, TOOLS_DIR, THEMEINJECTOR_DIR, THEMEINJECTOR_EXE);

                    const filePath = path.join(userDataPath, PROJECTS_DIR, projectId, fileName);
                    // Unpack the szs next to the original file
                    try {
                        const layoutFile = await context.$ipcService.fs.selectLayoutFile();
                        if (layoutFile?.length > 0) {
                            toolLog.info("Applying layout json:", layoutinjectorPath, ["szs", filePath, layoutFile, `out=${filePath.replace(".szs", ".new.szs")}`].join(" "));
                            execFile(layoutinjectorPath, ["szs", filePath, layoutFile, `out=${filePath}`], (_err, stdout, stderr) => {
                                // ^ szs <input szs file> <layout json> <out=outfile.szs>
                                if (stdout) toolLog.info(stdout);
                                if (stderr) {
                                    toolLog.error(stderr);
                                    context.$popup.error(new Error(stderr.trim()));
                                }
                                resolve(null);
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        toolLog.error(e);
                        resolve(null);
                    }
                });
            },
        },
    };

    // Check for updates on boot
    if (context.store.state.settings.checkToolUpdatesOnLaunch) {
        $toolManager.updateAllTools().then();
    }

    inject("toolManager", $toolManager);
    context.$toolManager = $toolManager;
}
