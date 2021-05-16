import * as fs from "fs";
import * as path from "path";
import {LAYOUTEDITOR_DIR, SARCTOOL_DIR, TOOLBOX_DIR, TOOLS_DIR, VERSION_CFG} from "./managerUtils";
import axios from "axios";
import Downloader from "nodejs-file-downloader";
import AdmZip from "adm-zip";
import * as trash from "trash";

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

            await fetchLatestGithubAsset(directory, LAYOUTEDITOR_DIR, url, "application/octet-stream");
        },
        async updateAllTools() {
            await $toolManager.updateSarcTool();
            await $toolManager.updateToolbox();
            await $toolManager.updateLayoutEditor();
            context.store.commit("CHECKING_FOR_TOOL_UPDATES_MESSAGE", "");
        },
    };

    // Check for updates on boot
    if (context.store.state.settings.checkToolUpdatesOnLaunch) {
        $toolManager.updateAllTools().then();
    }

    inject("toolManager", $toolManager);
    context.$toolManager = $toolManager;
}
