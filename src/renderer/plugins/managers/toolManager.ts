import * as fs from "fs";
import * as path from "path";
import {
    getFiles,
    LAYOUTEDITOR_DIR,
    PROJECTS_DIR,
    SARCTOOL_DIR,
    SARCTOOL_EXE,
    TOOLBOX_DIR,
    TOOLBOX_EXE,
    TOOLS_DIR,
    VERSION_CFG,
} from "./managerUtils";
import axios from "axios";
import Downloader from "nodejs-file-downloader";
import AdmZip from "adm-zip";
import * as trash from "trash";
import {execFile} from "child_process";

const UPDATE_MESSAGE_TIMEOUT = 300;

export default (context: any, inject: any) => {
    const setUpdateMessage = (message: string) => {
        console.log(message);
        context.store.commit("CHECKING_FOR_TOOL_UPDATES_MESSAGE", message);
    };
    const fetchLatestGithubAsset = (toolDir, toolName, url, expectedMimeType) => {
        return new Promise((resolve) => {
            console.log(`[${toolName}] Checking for updates...`);
            fs.readFile(path.join(toolDir, VERSION_CFG), "utf8", (err, versionString) => {
                let currentVersion = versionString;
                if (err) currentVersion = String(0);

                axios.get(url)
                    .then((res) => {
                        const releases = res.data;
                        if (releases?.length > 0) {
                            const asset = res.data[0]["assets"].find((a) => a.content_type === expectedMimeType);
                            const directUrl = asset?.browser_download_url;
                            const updatedAt = asset?.updated_at;
                            const assetName = asset?.name;
                            const newVersion = new Date(updatedAt).getTime().toString();
                            if (directUrl && currentVersion < newVersion) {
                                setUpdateMessage(`[${toolName}] Downloading update...`);
                                setTimeout(async () => {
                                    const downloader = new Downloader({
                                        url: directUrl,
                                        directory: toolDir,
                                        cloneFiles: false,
                                    });

                                    const zipPath = path.join(toolDir, assetName);
                                    try {
                                        await downloader.download();
                                        setUpdateMessage(`[${toolName}] Download done, unpacking...`);
                                        const zip = new AdmZip(zipPath);
                                        await zip.extractAllTo(toolDir, true);
                                        fs.writeFileSync(path.join(toolDir, VERSION_CFG), newVersion);
                                        setUpdateMessage(`[${toolName}] Update completed!`);
                                        setTimeout(() => {
                                            resolve(null);
                                        }, UPDATE_MESSAGE_TIMEOUT);
                                    } catch (e) {
                                        console.error(e);
                                        setUpdateMessage(`[${toolName}] Download failed!`);
                                        setTimeout(() => {
                                            resolve(null);
                                        }, UPDATE_MESSAGE_TIMEOUT + 200);
                                    } finally {
                                        await trash(zipPath);
                                    }
                                }, UPDATE_MESSAGE_TIMEOUT);
                            } else {
                                console.log(`[${toolName}] No update found`);
                                resolve(null);
                            }
                        } else {
                            console.log(`[${toolName}] No releases found`);
                            resolve(null);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        setUpdateMessage(`[${toolName}] Could not check for updates`);
                        setTimeout(() => {
                            resolve(null);
                        }, UPDATE_MESSAGE_TIMEOUT);
                    });
            });
        });
    };

    const $toolManager = {
        async updateSarcTool() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, SARCTOOL_DIR);
            const url = "https://api.github.com/repos/aboood40091/SARC-Tool/releases";

            await fetchLatestGithubAsset(directory, SARCTOOL_DIR, url, "application/x-zip-compressed");
        },
        async updateToolbox() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, TOOLBOX_DIR);
            const url = "https://api.github.com/repos/KillzXGaming/Switch-Toolbox/releases";

            await fetchLatestGithubAsset(directory, TOOLBOX_DIR, url, "application/octet-stream");
        },
        async updateLayoutEditor() {
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const directory = path.join(userDataPath, TOOLS_DIR, LAYOUTEDITOR_DIR);
            const url = "https://api.github.com/repos/FuryBaguette/SwitchLayoutEditor/releases";

            await fetchLatestGithubAsset(directory, LAYOUTEDITOR_DIR, url, "application/x-zip-compressed");
        },
        async updateAllTools() {
            await $toolManager.updateSarcTool();
            await $toolManager.updateToolbox();
            await $toolManager.updateLayoutEditor();
            context.store.commit("CHECKING_FOR_TOOL_UPDATES_MESSAGE", "");
        },
        szs: {
            unpack(filePath) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const sarcToolPath = path.join(userDataPath, SARCTOOL_DIR, SARCTOOL_EXE);
                    // Unpack the szs next to the original file
                    execFile(sarcToolPath, [filePath], function (err, data) {
                        if (err) console.log(err);
                        else resolve(null);
                    });
                });
            },
            pack(originDir, destFile) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const sarcToolPath = path.join(userDataPath, SARCTOOL_DIR, SARCTOOL_EXE);
                    // Unpack the szs next to the original file
                    execFile(sarcToolPath, ["-little", "-compress", "0", "-o", destFile, originDir], function (err, data) {
                        if (err) console.log(err);
                        else resolve(null);
                    });
                });
            },
        },
        toolbox: {
            open() {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const toolboxPath = path.join(userDataPath, TOOLBOX_DIR, TOOLBOX_EXE);
                    execFile(toolboxPath, function (err, data) {
                        if (err) console.log(err);
                        else resolve(null);
                    });
                });
            },
            openFiles(projectId: string, files: Array<string>) {
                return new Promise(async (resolve) => {
                    const userDataPath = await context.$ipcService.fs.getUserDataPath();
                    const toolboxPath = path.join(userDataPath, TOOLBOX_DIR, TOOLBOX_EXE);
                    const filePaths = files.map((f) => path.join(userDataPath, PROJECTS_DIR, projectId, f));
                    execFile(toolboxPath, filePaths, function (err, data) {
                        if (err) console.log(err);
                        else resolve(null);
                    });
                });
            },
            async openFolder(projectId) {
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const projectPath = path.join(userDataPath, PROJECTS_DIR, projectId);
                const fileNames = getFiles(projectPath);
                await this.openFiles(projectId, fileNames);
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
