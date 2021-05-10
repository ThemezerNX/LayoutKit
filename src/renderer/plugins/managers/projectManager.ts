import * as fs from "fs";
import * as path from "path";
import * as trash from "trash";
import {ncp} from "ncp";
import {shell} from "electron";
import * as mkdirp from "mkdirp";
import editJsonFile from "edit-json-file";
import {FIRMWARE_VERSION_CFG, FIRMWARES_DIR, getDirectories, PROJECTS_DIR} from "./managerUtils";

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
    const $projectManager = {
        refresh() {
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
                    });
                });
            }, 500);
        },
        openInExplorer(projectId: string) {
            context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                shell.openPath(path.join(userDataPath, PROJECTS_DIR, projectId));
            });
        },
        delete(projectId: string) {
            return new Promise(((resolve) => {
                context.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                    resolve(trash(path.join(userDataPath, PROJECTS_DIR, projectId)).then(this.refresh));
                });
            }));
        },
        setName(projectId: string, newName: string) {
            updateDetails(projectId, "name", newName);
        },
        setBuildDate(projectId: string, date: Date) {
            updateDetails(projectId, "lastBuild", date.getTime().toString());
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
                            detailsFile.set("lastBuild", null);
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
                            path.endsWith(FIRMWARE_VERSION_CFG) ||
                            selectedFirmwareFiles.some((f) => path.endsWith(f)),
                    }, () => {
                        try {
                            const detailsFile = editJsonFile(path.join(projectPath, DETAILS_FILE));
                            detailsFile.set("name", name);
                            detailsFile.set("firmware", firmware);
                            detailsFile.set("lastBuild", null);
                            detailsFile.save();
                            context.store.commit("ACTIVE_PROJECT", {
                                id: id,
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

    };

    inject("projectManager", $projectManager);
    context.$projectManager = $projectManager;
}
