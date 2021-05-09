import * as fs from "fs";

const PROJECTS_DIR = "projects";
const FIRMWARES_DIR = "firmwares";

const getDirectories = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .filter(d => d.isDirectory())
        .map(d => d.name);

export {PROJECTS_DIR, FIRMWARES_DIR, getDirectories};