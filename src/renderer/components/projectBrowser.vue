<template>
    <div>
        <vse-card shadow width="100%">
            <template #title>
                <h2>Project Browser</h2>
            </template>
            <template #content>
                <vs-select v-if="renderVSSelect" v-model="activeProjectId" :disabled="projects.length === 0"
                           :loading="projectsLoading"
                           filter
                           placeholder="Select Project">
                    <template v-for="project in projects">
                        <vs-option
                            :key="project.id"
                            :label="project.name"
                            :value="project.id"
                        >
                            {{ project.name }}
                        </vs-option>
                    </template>
                </vs-select>
                <vs-button
                    :disabled="projectsLoading"
                    icon
                    @click="refresh()"
                >
                    <i :class="{spin: spinRefreshIcon}" class='bx bx-refresh'></i>
                </vs-button>
                <vse-spacer/>
                <vs-button
                    :disabled="openInToolboxLoading || projectsLoading || projects.length === 0 || !(activeProjectId && activeProjectId.length > 0)"
                    :loading="openInToolboxLoading"
                    icon
                    color="#0096D8"
                    @click="openInToolbox()"
                >
                    <i class='bx bx-wrench'></i> Open All In Toolbox
                </vs-button>
                <vse-spacer/>
                <vs-button
                    :disabled="projectsLoading || projects.length === 0 || !(activeProjectId && activeProjectId.length > 0)"
                    icon
                    @click="$refs['editProjectDialog'].active = true">
                    <i class='bx bx-pencil'></i>
                </vs-button>
                <vs-button
                    :disabled="projectsLoading || projects.length === 0 || !(activeProjectId && activeProjectId.length > 0)"
                    icon
                    @click="$refs['copyProjectDialog'].active = true">
                    <i class='bx bx-copy'></i> Copy
                </vs-button>
                <vs-button :disabled="projectsLoading" icon @click="$refs['newProjectDialog'].active = true">
                    <i class='bx bx-plus'></i> New
                </vs-button>
            </template>
            <template #content2>
                <div ref="firmwareLoader" class="firmware-loader"/>
                <vs-table v-if="firmwareFiles.length > 0" class="firmware-files-table">
                    <template #thead>
                        <vs-tr>
                            <vs-th>
                                Menu
                            </vs-th>
                            <vs-th>
                                Filename
                            </vs-th>
                            <vs-th style="width: 100px;">
                                Actions
                            </vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <template
                            v-for="file in firmwareFiles">
                            <vs-tr
                                :key="file"
                                :data="file"
                            >
                                <vs-td>
                                    {{ toNice(file) }}
                                </vs-td>
                                <vs-td>
                                    {{ file }}
                                </vs-td>
                                <vs-td class="actions">
                                    <vs-button
                                        :disabled="projectsLoading || openFileInToolboxLoading[file]"
                                        :loading="openFileInToolboxLoading[file]"
                                        icon
                                        color="#0096D8"
                                        @click="openFileInToolbox(file)"
                                    >
                                        <i class='bx bx-wrench'></i>
                                    </vs-button>
                                    <delete-dialog
                                        :args="[file]"
                                        :disabled="projectsLoading || firmwareFiles.length === 1"
                                        :handle="deleteFirmwareFile" :callback="getFirmwareFiles">
                                        <template #dataType>
                                            project
                                        </template>
                                    </delete-dialog>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </template>
                </vs-table>
            </template>
        </vse-card>
        <copy-project ref="copyProjectDialog"/>
        <new-project ref="newProjectDialog"/>
        <edit-project ref="editProjectDialog"/>
    </div>
</template>

<script>
import newProject from "~/components/newProject.vue";
import copyProject from "~/components/copyProject.vue";
import editProject from "~/components/editProject";
import deleteDialog from "~/components/deleteDialog.vue";
import {toNice} from "@themezernx/target-parser/dist";

export default {
    data: () => ({
        loading: false,
        renderVSSelect: true,
        spinRefreshIcon: false,
        firmwareFiles: [],
        loader: null,
        openInToolboxLoading: false,
        openFileInToolboxLoading: {},
    }),
    components: {newProject, copyProject, editProject, deleteDialog},
    mounted() {
        this.refresh();
    },
    computed: {
        projectsLoading() {
            return this.loading || this.$store.state.projectsLoading;
        },
        projects() {
            return this.$store.state.projects;
        },
        activeProjectId: {
            get() {
                return this.$store.state.activeProject.id;
            },
            set(value) {
                this.showFirmwareLoader();
                this.$store.commit("ACTIVE_PROJECT", this.projects.find((p) => p.id === value));
            },
        },
        installOnChange: {
            get() {
                return this.$store.state.settings.installOnChange;
            },
            set(value) {
                this.$store.commit("settings/INSTALL_ON_CHANGE", value);
            },
        },
        rebootOnInstall: {
            get() {
                return this.$store.state.settings.rebootOnInstall;
            },
            set(value) {
                this.$store.commit("settings/REBOOT_ON_INSTALL", value);
            },
        },
    },
    watch: {
        activeProjectId: {
            immediate: true, // also watch initialization
            handler(newVal, oldVal) {
                console.log(newVal, oldVal);
                if (newVal && (oldVal || oldVal === "") && newVal !== oldVal) {
                    this.getFirmwareFiles(newVal);
                    this.$projectManager.createWatcher(newVal);
                }
            },
        },
        projectsLoading(value) {
            if (value) {
                this.showFirmwareLoader();
            } else {
                this.loader?.close();
                this.loader = null;
            }
        },
        projects(newValue) {
            // Remove activeProjectId if it was not found
            if (this.activeProjectId.length > 0 && !newValue.some((p) => p.id === this.activeProjectId)) {
                this.activeProjectId = null;
                this.firmwareFiles = [];
                this.loader?.close();
                this.loader = null;
            }
            // Force rerender the dropdown, since the label is empty if the id changed while only one option was available
            this.forceRerenderVSSelect();
        },
    },
    methods: {
        forceRerenderVSSelect() {
            this.renderVSSelect = false;
            this.$nextTick(() => {
                this.renderVSSelect = true;
            });
        },
        showFirmwareLoader() {
            if (!this.loader) {
                this.loader = this.$vs.loading({
                    target: this.$refs.firmwareLoader,
                    opacity: "0.5",
                });
            }
        },
        refresh() {
            if (!this.projectsLoading) {
                this.spinRefreshIcon = true;
                setTimeout(() => {
                    this.spinRefreshIcon = false;
                }, 300);
            }

            this.firmwareFiles = [];
            this.$projectManager.refresh().then(() => {
                this.getFirmwareFiles();
            });
        },
        toNice(filename) {
            return toNice(filename);
        },
        deleteFirmwareFile(file) {
            this.showFirmwareLoader();
            return this.$projectManager.deleteFirmwareFile(this.activeProjectId, file);
        },
        getFirmwareFiles(id) {
            this.$projectManager.firmwareFiles(id || this.activeProjectId).then((files) => {
                this.firmwareFiles = files;
                this.loader?.close();
                this.loader = null;
            });
        },
        openFileInToolbox(fileName) {
            this.$set(this.openFileInToolboxLoading, fileName, true);
            this.$toolManager.toolbox.openProjectFiles(this.activeProjectId, [fileName]).then(() => {
                this.$set(this.openFileInToolboxLoading, fileName, false);
            });
        },
        openInToolbox() {
            this.openInToolboxLoading = true;
            this.$toolManager.toolbox.openProjectFolder(this.activeProjectId).then(() => {
                this.openInToolboxLoading = false;
            });
        },
    },
};
</script>

<style lang="scss">
.firmware-loader {
    min-height: 394px;
    z-index: 10;
    border-radius: 14px;
}

.firmware-files-table {
    margin: auto;
    margin-top: 0;
}
</style>