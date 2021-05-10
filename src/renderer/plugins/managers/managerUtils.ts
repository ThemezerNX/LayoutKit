import * as fs from "fs";

const PROJECTS_DIR = "projects";
const FIRMWARES_DIR = "firmwares";
const FIRMWARE_VERSION_CFG = "ver.cgf";

const getDirectories = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .filter(d => d.isDirectory())
        .map(d => d.name);

const getFiles = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .map(d => d.name);

export {PROJECTS_DIR, FIRMWARES_DIR, FIRMWARE_VERSION_CFG, getDirectories, getFiles};