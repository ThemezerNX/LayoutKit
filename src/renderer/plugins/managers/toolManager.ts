import * as fs from "fs";
import * as path from "path";
import {
    FIRMWARES_DIR,
    getFiles,
    LAYOUTEDITOR_DIR,
    LAYOUTEDITOR_EXE,
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
        expectedMimeTypes,
        assetNameContains,
        directUrl,
        directVersion,
    }) => {
        return new Promise((resolve) => {
            toolLog.info(`[${toolName}] Checking for updates...`);
            fs.readFile(path.join(toolDir, VERSION_CFG), "utf8", async (err, versionString) => {
                let currentVersion = versionString;
                if (err || isNaN(Number(currentVersion))) currentVersion = String(0);

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
                                expectedMimeTypes.includes(a.content_type)  &&
                                (assetNameContains ? a.name.includes(assetNameContains) : true),
                            );
                            asset.url = githubAsset?.browser_download_url;
                            asset.name = githubAsset?.name;
                            asset.version = new Date(githubAsset?.updated_at).getTime().toString();
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
                    expectedMimeTypes: ["application/x-zip-compressed", "application/zip"],
                    assetNameContains: null,
                    directUrl: null,
                    directVersion: null,
                },
            );
        },
        async updateThemeInjector() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, THEMEINJECTOR_DIR);
            const url = "https://api.github.com/repos/exelix11/SwitchThemeInjector/releases";
            await fetchLatestAsset(
                directory,
                THEMEINJECTOR_DIR,
                {
                    url,
                    expectedMimeTypes: ["application/x-zip-compressed", "application/zip"],
                    assetNameContains: ".zip",
                    directUrl: null,
                    directVersion: null,
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
                    expectedMimeTypes: ["application/octet-stream"],
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
                    expectedMimeTypes: ["application/x-zip-compressed", "application/zip"],
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
            await $toolManager.updateLayoutEditor();
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
        editor: {
            open() {
                return this.openPaths([]); // quick solution
            },
            openPaths(paths: Array<string>, awaitClose: boolean = false) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    let editorWorkingDir, editorPath;
                    if (context.store.state.settings.preferredEditor === "toolbox") {
                        editorWorkingDir = path.join(userDataPath, TOOLS_DIR, TOOLBOX_DIR);
                        editorPath = path.join(userDataPath, TOOLS_DIR, TOOLBOX_DIR, TOOLBOX_EXE);
                    } else if (context.store.state.settings.preferredEditor === "layouteditor") {
                        editorWorkingDir = path.join(userDataPath, TOOLS_DIR, LAYOUTEDITOR_DIR);
                        editorPath = path.join(userDataPath, TOOLS_DIR, LAYOUTEDITOR_DIR, LAYOUTEDITOR_EXE);
                    }

                    const ls = spawn(editorPath, paths, {cwd: editorWorkingDir});
                    ls.stdout.on("error", (data) => {
                        toolLog.error(data);
                    });
                    // If this "on data" is not here, the switch-toolbox will freeze when for example opening RdtBase.bflyt
                    ls.stdout.on("data", () => {
                    });

                    if (awaitClose) {
                        ls.stdout.on("end", () => {
                            resolve(null);
                        });
                    } else {
                        setTimeout(() => {
                            resolve(null);
                        }, 500);
                    }
                });
            },
            async openFolder(dirPath, awaitClose: boolean = false) {
                const filePaths = getFiles(dirPath)
                    .map((f) => path.join(dirPath, f));
                await this.openPaths(filePaths, awaitClose);
            },
            async openProjectFiles(projectId: string, files: Array<string>) {
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const filePaths = files.map((f) => path.join(userDataPath, PROJECTS_DIR, projectId, f));
                await this.openPaths(filePaths, true);
            },
            async openProjectFolder(projectId) {
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const projectPath = path.join(userDataPath, PROJECTS_DIR, projectId);
                await this.openFolder(projectPath, true);
            },
        },
        layoutinjector: {
            createLayoutJson(projectId: string, fileName: string) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const layoutinjectorPath = path.join(userDataPath, TOOLS_DIR, THEMEINJECTOR_DIR, THEMEINJECTOR_EXE);

                    const stockPath = path.join(userDataPath, FIRMWARES_DIR, context.store.state.activeProject.firmware, fileName);
                    const filePath = path.join(userDataPath, PROJECTS_DIR, projectId, fileName);
                    const newFileName = `${context.store.state.activeProject.name} (${toNice(fileName)})`;
                    // Unpack the szs next to the original file
                    try {
                        const savePath = await context.$ipcService.fs.selectSaveLocation("Select save location for layout", newFileName + ".json", "Layout JSON", "json");
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
                                    json.set("PatchName", newFileName);
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
                    try {
                        const layoutFile = await context.$ipcService.fs.selectLayoutFile();
                        if (layoutFile?.length > 0) {
                            toolLog.info("Applying layout json:", layoutinjectorPath, ["szs", filePath, layoutFile, `out=${filePath}`].join(" "));
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
