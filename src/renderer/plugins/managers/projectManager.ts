import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";
import {ncp} from "ncp";
import {shell} from "electron";
import * as mkdirp from "mkdirp";
import editJsonFile from "edit-json-file";
import {FIRMWARES_DIR, getDirectories, getFiles, PROJECTS_DIR} from "./managerUtils";
import {isTarget} from "@themezernx/target-parser/dist";
import log from "electron-log";

const projectLog = log.scope("projectManager");

const DETAILS_FILE = "details.json";
const INVALID_ID_CHARS_REGEX = /[\\~#*{}\/:<>?|"\s]/gm;

const nameToId = (name) =>
    name.replace(INVALID_ID_CHARS_REGEX, "_") + "-" + new Date().getTime();

export default (context: any, inject: any) => {
    const updateDetails = (projectId: string, key: string, value: string) => {
        const project = context.store.state.projects.find((p) => p.id === projectId);
        if (project) {
            const newProject = Object.assign({}, project);
            newProject[key] = value;
            context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                if (newProject.id === context.store.state.activeProject.id) {
                    // If this project is the active project
                    context.store.commit("ACTIVE_PROJECT", newProject);
                }
                const detailsFile = editJsonFile(path.join(userDataPath, PROJECTS_DIR, newProject.id, DETAILS_FILE));
                detailsFile.set(key, newProject[key]);
                detailsFile.save();

                $projectManager.refresh();
            });
        }
    };

    let watcher = null;
    const activeQueue: any = [];
    const $projectManager = {
        refresh() {
            return new Promise((resolve) => {
                context.store.commit("PROJECTS_LOADING", true);
                setTimeout(() => {
                    context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                        const projectsPath = path.join(userDataPath, PROJECTS_DIR);
                        mkdirp(projectsPath).then(() => {
                            const projectFolders = getDirectories(projectsPath);
                            const projects = projectFolders.map((dir) => {
                                try {
                                    // Remove the appendix set in newProject.vue:
                                    return {
                                        id: dir,
                                        ...JSON.parse(fs.readFileSync(path.join(projectsPath, dir, DETAILS_FILE)).toString()),
                                    };
                                } catch (e) {
                                    context.$popup.error(e);
                                    return null;
                                }
                            }).filter(p => !!p);
                            context.store.commit("PROJECTS_LOADING", false);
                            context.store.commit("PROJECTS", projects);
                            resolve(null);
                        });
                    });
                }, 100);
            });
        },
        trimProjectIdTimestamp(projectId: string) {
            // Trim the unix timestamp, see projectManager for why it is included
            const matches = /(.*)-/gm.exec(projectId);
            return matches?.length > 1 ? matches[1] : projectId;
        },
        firmwareFiles(id: string) {
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const projectPath = path.join(userDataPath, PROJECTS_DIR, id);
                    const files = getFiles(projectPath);
                    const usableFiles = files.filter((f) => isTarget(f));
                    resolve(usableFiles);
                });
            });
        },
        openInExplorer(projectId: string) {
            context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                shell.openPath(path.join(userDataPath, PROJECTS_DIR, projectId)).then();
            });
        },
        deleteFirmwareFile(projectId: string, file: string) {
            return new Promise(((resolve) => {
                context.$ipcService.fs.getUserDataPath().then(async (userDataPath) => {
                    await context.$ipcService.fs.trash([
                        path.join(userDataPath, PROJECTS_DIR, projectId, file), // file
                        // path.join(userDataPath, PROJECTS_DIR, projectId, matches[1]), // folder
                    ]);
                    resolve(null);
                    await this.refresh();
                });
            }));
        },
        delete(projectId: string) {
            return new Promise(((resolve) => {
                context.$ipcService.fs.getUserDataPath().then(async (userDataPath) => {
                    await context.$ipcService.fs.trash([path.join(userDataPath, PROJECTS_DIR, projectId)]);
                    resolve(null);
                    await this.refresh();
                });
            }));
        },
        setName(projectId: string, newName: string) {
            updateDetails(projectId, "name", newName);
        },
        addNewFirmwareFiles(projectId: string, firmware: string, files: Array<string>) {
            if (files?.length > 0) {
                return new Promise((resolve) => {
                    context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                        const firmwarePath = path.join(userDataPath, FIRMWARES_DIR, firmware);
                        const projectPath = path.join(userDataPath, PROJECTS_DIR, projectId);

                        ncp(firmwarePath, projectPath, {
                            filter: (path) =>
                                fs.lstatSync(path).isDirectory() ||
                                files.some((f) => path.endsWith(f)),
                        }, () => {
                            resolve(null);
                        });
                    });
                });
            } else return;
        },
        setInstallDate(projectId: string) {
            updateDetails(projectId, "lastInstall", new Date().toString());
        },
        copyToNew(oldId, newName) {
            const newId = nameToId(newName);
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const oldProjectPath = path.join(userDataPath, PROJECTS_DIR, oldId);
                    const newProjectPath = path.join(userDataPath, PROJECTS_DIR, newId);
                    ncp(oldProjectPath, newProjectPath, () => {
                        try {
                            const detailsFile = editJsonFile(path.join(newProjectPath, DETAILS_FILE));
                            detailsFile.set("name", newName);
                            detailsFile.set("lastInstall", null);
                            detailsFile.save();
                            context.store.commit("ACTIVE_PROJECT", {
                                id: newId,
                                ...detailsFile.get(),
                            });

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
        createNew(name, firmware, selectedFirmwareFiles) {
            const id = nameToId(name);
            // This appendix is required https://github.com/lusaxweb/vuesax-next/issues/121
            return new Promise((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    const firmwarePath = path.join(userDataPath, FIRMWARES_DIR, firmware);
                    const projectPath = path.join(userDataPath, PROJECTS_DIR, id);

                    ncp(firmwarePath, projectPath, {
                        filter: (path) =>
                            fs.lstatSync(path).isDirectory() ||
                            selectedFirmwareFiles.some((f) => path.endsWith(f)),
                    }, () => {
                        try {
                            const detailsFile = editJsonFile(path.join(projectPath, DETAILS_FILE));
                            detailsFile.set("name", name);
                            detailsFile.set("firmware", firmware);
                            detailsFile.set("lastInstall", null);
                            detailsFile.save();
                            context.store.commit("ACTIVE_PROJECT", {
                                id: id,
                                ...detailsFile.get(),
                            });

                            // TODO unpack szs files

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
        async createWatcher(projectId) {
            context.store.commit("CLEAR_PUSH_QUEUE");
            context.store.commit("PUSHED_INITIAL", false);
            // After switching the active project, clear the pushQueue and enable the install changes button and push ALL files the first time.
            // After that, put every detected changed file path in the pushQueue
            // Changes queue list

            // Initialize changes watcher
            // The easiest is to just watch for the whole projects folder, check the filename and upload
            const userDataPath = await context.$ipcService.fs.getUserDataPath();
            const projectPath = path.join(userDataPath, PROJECTS_DIR, projectId);
            if (!!watcher) {
                // Only watch one project directory at a time
                await watcher.close();
            }
            projectLog.info("Creating watcher on", projectPath);
            watcher = chokidar.watch(projectPath, {
                ignored: /(^|[\/\\])\../, // ignore dotfiles
                persistent: true,
            });

            watcher.on("change", (p) => {
                projectLog.info(`[projectManager] File ${p} has been changed`);
                // If the initial state has been pushed
                if (context.store.state.pushedInitial) {
                    const filename = path.basename(p);
                    if (isTarget(filename) && !context.store.state.pushQueue.includes(p)) {
                        context.store.commit("ADD_PUSH_QUEUE", p);
                        if (context.store.state.settings.installOnChange) {
                            $projectManager.installQueue().then();
                        }
                    }
                }
            });
        },
        async installQueue() {
            // If the initial project state hasn't been pushed yet
            if (!context.store.state.pushedInitial) {
                projectLog.info("[projectManager] Initial state not pushed, fetching files");
                const userDataPath = await context.$ipcService.fs.getUserDataPath();
                const projectPath = path.join(userDataPath, PROJECTS_DIR, context.store.state.activeProject.id);
                const projectFiles = getFiles(projectPath).filter((p) => isTarget(path.basename(p)));
                projectFiles.forEach(f => {
                    activeQueue.push(path.join(projectPath, f));
                });
            } else {
                context.store.state.pushQueue.forEach(f => {
                    activeQueue.push(f);
                });
                context.store.commit("CLEAR_PUSH_QUEUE");
            }

            // If not already installing something
            if (!context.store.state.pushingChanges) {
                context.store.commit("PUSHING_CHANGES", true);
                while (activeQueue.length > 0) {
                    const sending = Array.from(activeQueue);
                    activeQueue.length = 0;
                    await context.$ftpController.install(sending);
                }
                $projectManager.setInstallDate(context.store.state.activeProject.id);
                context.store.commit("PUSHING_CHANGES", false);
                context.store.commit("PUSHED_INITIAL", true);
            }
        },
    };

    // Set pushed_initial to false on boot
    context.store.commit("PUSHED_INITIAL", false);
    context.store.commit("PUSHING_CHANGES", false);
    context.store.commit("CLEAR_PUSH_QUEUE");

    inject("projectManager", $projectManager);
    context.$projectManager = $projectManager;
}
