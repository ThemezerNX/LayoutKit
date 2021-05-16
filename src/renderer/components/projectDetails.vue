<template>
    <vse-card :disabled="projectsLoading" shadow width="100%">
        <template #title>
            <h2>Project Details</h2>
        </template>
        <template #subtitle>
            <b>ID:</b> {{ activeProjectIdTrimmed }}<br/>
            <b>FW:</b> {{ activeProjectFirmware }}<br/>
            <b>Last build:</b> {{ activeProjectLastBuild || "never" }}
        </template>
        <template #content>
            <vse-list class="form">
                <vse-list-item>
                    <template #button>
                        <vs-input
                            v-model="activeProjectName"
                            block
                            class="pb-10"
                            placeholder="Name"
                        />
                    </template>
                </vse-list-item>
                <vse-list-item>
                    <template #button>
                        <vse-spacer/>
                        <vs-button icon @click="openInExplorer()">
                            Open Folder
                            <i class='bx bx-link-external'></i>
                        </vs-button>
                        <delete-dialog :handle="deleteProject">
                            <template #dataType>
                                project
                            </template>
                        </delete-dialog>
                    </template>
                </vse-list-item>
            </vse-list>
        </template>
    </vse-card>
</template>

<script>
import deleteDialog from "~/components/deleteDialog.vue";

const DONE_TYPING_INTERVAL = 500;

export default {
    components: {deleteDialog},
    data: () => ({
        rebootLoading: false,
        typingTimer: {
            name: null,
        },
    }),
    computed: {
        projectsLoading() {
            return this.$store.state.projectsLoading;
        },
        activeProjectIdTrimmed() {
            this.$projectManager.trimProjectIdTimestamp(this.activeProjectId);
        },
        activeProjectId() {
            return this.$store.state.activeProject.id;
        },
        activeProjectLastBuild() {
            return this.$store.state.activeProject.lastBuild;
        },
        activeProjectFirmware() {
            return this.$store.state.activeProject.firmware;
        },
        activeProjectName: {
            get() {
                return this.$store.state.activeProject.name;
            },
            set(value) {
                clearTimeout(this.typingTimer.name);
                this.typingTimer.name = setTimeout(() => {
                    this.saveName(value);
                    clearTimeout(this.typingTimer.name);
                }, DONE_TYPING_INTERVAL);
            },
        },
        lastBuild: {
            get() {
                return this.$store.state.activeProject.lastBuild;
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
    methods: {
        restartConsole() {
            this.rebootLoading = true;
            setTimeout(() => {
                this.rebootLoading = false;
            }, 5000);
        },
        saveName(newName) {
            this.$projectManager.setName(this.activeProjectId, newName);
        },
        openInExplorer() {
            this.$projectManager.openInExplorer(this.activeProjectId);
        },
        deleteProject() {
            return this.$projectManager.delete(this.activeProjectId);
        },
    },
};
</script>
