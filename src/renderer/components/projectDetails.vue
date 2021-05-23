<template>
    <vse-card :disabled="projectsLoading" shadow width="100%" max-width="450px" style="margin-left: 0">
        <template #title>
            <h2>Project Details</h2>
        </template>
        <template #subtitle>
            <h3>{{ activeProjectName }}</h3>
            <br/>
            <b>ID:</b> {{ activeProjectIdTrimmed }}<br/>
            <b>FW:</b> {{ activeProjectFirmware }}<br/>
            <b>Last Install:</b> {{ activeProjectLastInstall || "never" }}
        </template>
        <template #content>
            <vse-list>
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
import fromNow from "from-now";

export default {
    components: {deleteDialog},
    data: () => ({
        rebootLoading: false,
        forceRecomputeCounter: 0,
    }),
    mounted() {
        setInterval(() => {
            this.forceRecomputeCounter++;
        }, 1000);
    },
    computed: {
        projectsLoading() {
            return this.$store.state.projectsLoading;
        },
        activeProjectIdTrimmed() {
            return this.$projectManager.trimProjectIdTimestamp(this.activeProjectId);
        },
        activeProjectId() {
            return this.$store.state.activeProject.id;
        },
        activeProjectLastInstall() {
            this.forceRecomputeCounter;
            const date = this.$store.state.activeProject.lastInstall;
            if (date) {
                try {
                    const fromString = fromNow(date);
                    return fromString.toLowerCase() === "now" ? fromString : `${fromString} ago`;
                } catch (e) {
                    console.error(e);
                    return null;
                }
            } else {
                return null;
            }
        },
        activeProjectFirmware() {
            return this.$store.state.activeProject.firmware;
        },
        activeProjectName() {
            return this.$store.state.activeProject.name;
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
        openInExplorer() {
            this.$projectManager.openInExplorer(this.activeProjectId);
        },
        deleteProject() {
            return this.$projectManager.delete(this.activeProjectId);
        },
    },
};
</script>
