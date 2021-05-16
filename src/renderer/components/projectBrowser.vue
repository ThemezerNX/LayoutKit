<template>
    <div>
        <vse-card shadow style="height: 500px" width="100%">
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
                    :disabled="projectsLoading || projects.length === 0 || !(activeProjectId && activeProjectId.length > 0)"
                    icon
                    @click="$refs['copyProjectDialog'].active = true">
                    <i class='bx bx-copy'></i> Copy
                </vs-button>
                <vs-button :disabled="projectsLoading" icon @click="$refs['newProjectDialog'].active = true">
                    <i class='bx bx-plus'></i> New
                </vs-button>
            </template>
        </vse-card>
        <copy-project ref="copyProjectDialog"/>
        <new-project ref="newProjectDialog"/>
    </div>
</template>

<script>
import newProject from "~/components/newProject.vue";
import copyProject from "~/components/copyProject.vue";

export default {
    data: () => ({
        renderVSSelect: true,
        spinRefreshIcon: false,
    }),
    components: {newProject, copyProject},
    mounted() {
        this.refresh();
    },
    computed: {
        projectsLoading() {
            return this.$store.state.projectsLoading;
        },
        projects() {
            return this.$store.state.projects;
        },
        activeProjectId: {
            get() {
                return this.$store.state.activeProject.id;
            },
            set(value) {
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
        projects(newValue) {
            // Remove activeProjectId if it was not found
            if (this.activeProjectId.length > 0 && !newValue.some((p) => p.id === this.activeProjectId)) {
                this.activeProjectId = null;
            }
            // Force rerender the dropdown, since the label is empty if the id changed while only one option was available
            this.forceRerenderVSSelect();
        },
    },
    methods: {
        refresh() {
            if (!this.projectsLoading) {
                this.spinRefreshIcon = true;
                setTimeout(() => {
                    this.spinRefreshIcon = false;
                }, 300);
            }

            this.$projectManager.refresh();
        },
        forceRerenderVSSelect() {
            this.renderVSSelect = false;
            this.$nextTick(() => {
                this.renderVSSelect = true;
            });
        },
    },
};
</script>