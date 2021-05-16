import * as fs from "fs";

const PROJECTS_DIR = "projects";
const FIRMWARES_DIR = "firmwares";
const VERSION_CFG = "ver.cfg";
const TOOLS_DIR = "tools";

const SARCTOOL_DIR = "sarctool";
const TOOLBOX_DIR = "toolbox";
const LAYOUTEDITOR_DIR = "layouteditor";

const getDirectories = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .filter(d => d.isDirectory())
        .map(d => d.name);

const getFiles = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .map(d => d.name);

export {
    PROJECTS_DIR,
    FIRMWARES_DIR,
    TOOLS_DIR,
    VERSION_CFG,
    SARCTOOL_DIR,
    TOOLBOX_DIR,
    LAYOUTEDITOR_DIR,
    getDirectories,
    getFiles,
};