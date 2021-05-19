import * as fs from "fs";
import * as path from "path";
import {toTitleId} from "@themezernx/target-parser/dist";

const PROJECTS_DIR = "projects";
const FIRMWARES_DIR = "firmwares";
const VERSION_CFG = "ver.cfg";
const TOOLS_DIR = "tools";

const SARCTOOL_DIR = "sarctool";
const SARCTOOL_EXE = "sarc_tool.exe";
const TOOLBOX_DIR = "toolbox";
const TOOLBOX_EXE = "Toolbox.exe";
const LAYOUTEDITOR_DIR = "layouteditor";
const LAYOUTEDITOR_EXE = "Switch Layout Editor.exe";

const getDirectories = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .filter(d => d.isDirectory())
        .map(d => d.name);

const getFiles = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .map(d => d.name);

const getFtpDestination = source => {
    const filename = path.basename(source);
    const titleId = toTitleId(filename);
    return `/atmosphere/contents/${titleId}/romfs/lyt/${filename}`;
};

export {
    PROJECTS_DIR,
    FIRMWARES_DIR,
    TOOLS_DIR,
    VERSION_CFG,
    SARCTOOL_DIR,
    SARCTOOL_EXE,
    TOOLBOX_DIR,
    TOOLBOX_EXE,
    LAYOUTEDITOR_DIR,
    LAYOUTEDITOR_EXE,
    getDirectories,
    getFiles,
    getFtpDestination,
};