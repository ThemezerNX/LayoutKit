<template>
    <vse-card shadow width="100%" style="height: 500px">
        <template #title>
            <h2>Project Browser</h2>
        </template>
        <template #content>
            <vs-select filter placeholder="Select Project" v-model="lastSelectedProject">
                <template v-for="project in projects">
                    <vs-option
                        :label="project.name"
                        :value="project.id"
                        :key="project.id"
                    >
                        {{ project.name }}
                    </vs-option>
                </template>
            </vs-select>
            <vs-button
                icon
            >
                <i class='bx bx-refresh'></i>
            </vs-button>
            <vse-spacer/>
            <vs-button icon>
                <i class='bx bx-plus'></i> New
            </vs-button>
        </template>
    </vse-card>
</template>

<script>
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

const getDirectories = source =>
    fs.readdirSync(source, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

export default {
    computed: {
        projects() {
            this.$ipcService.fs.getUserDataPath().then((userDataPath) => {
                console.log(userDataPath);
                const projectsPath = path.join(userDataPath, "projects");
                mkdirp(projectsPath).then(() => {
                    const projectFolders = getDirectories(projectsPath);
                    const projects = projectFolders.map((dir) => {
                        try {
                            return JSON.parse(fs.readFileSync(path.join(dir, "details.json")));
                        } catch (e) {
                            this.$popup.error(e);
                            return null;
                        }
                    });
                    console.log(projects.filter(p => !!p));
                });
            });


            return [
                {
                    name: "Test Project",
                    id: "testp",
                }
            ];
        },
        lastSelectedProject: {
            get() {
                return this.$store.state.lastSelectedProject;
            },
            set(value) {
                this.$store.commit("LAST_SELECTED_PROJECT", value);
            },
        },
        installOnChange: {
            get() {
                return this.$store.state.quickSettings.installOnChange;
            },
            set(value) {
                this.$store.commit("quickSettings/INSTALL_ON_CHANGE", value);
            },
        },
        rebootOnInstall: {
            get() {
                return this.$store.state.quickSettings.rebootOnInstall;
            },
            set(value) {
                this.$store.commit("quickSettings/REBOOT_ON_INSTALL", value);
            },
        },
    },
};
</script>
