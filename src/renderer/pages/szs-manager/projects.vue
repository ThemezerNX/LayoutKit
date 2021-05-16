<template>
    <div>
        <vse-card flex max-width="900px" shadow>
            <template #title>
                <h1>Projects</h1>
                <vse-spacer/>
                <vs-button
                    :disabled="projectsLoading"
                    icon
                    right
                    @click="refresh()"
                >
                    <i :class="{spin: spinRefreshIcon}" class='bx bx-refresh'></i>
                </vs-button>
            </template>
            <template #content>
                <vs-table :disabled="projectsLoading">
                    <template #thead>
                        <vs-tr>
                            <vs-th>
                                Name
                            </vs-th>
                            <vs-th style="width: 230px;">
                                Actions
                            </vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <template v-for="project in projects">
                            <vs-tr :key="project.id">
                                <vs-td>
                                    <h2 class="ma-0">{{ project.name }}</h2>
                                </vs-td>
                                <vs-td class="actions">
                                    <vs-button :disabled="projectsLoading" icon
                                               @click.stop="openInExplorer(project.id)">
                                        Open Folder
                                        <i class='bx bx-link-external'></i>
                                    </vs-button>
                                    <vs-button :disabled="projectsLoading" icon
                                               @click.stop="modifyProject(project)">
                                        <i class='bx bx-pencil'></i>
                                    </vs-button>
                                    <delete-dialog :args="[project.id]" :disabled="projectsLoading"
                                                   :handle="deleteProject">
                                        <template #dataType>
                                            project
                                        </template>
                                    </delete-dialog>
                                </vs-td>

                                <template v-if="getFirmwareFiles(project.id).length > 0"
                                          #expand>
                                    <vs-table>
                                        <template #thead>
                                            <vs-tr>
                                                <vs-th>
                                                    Menu
                                                </vs-th>
                                                <vs-th>
                                                    Filename
                                                </vs-th>
                                                <vs-th style="width: 50px;">
                                                    Actions
                                                </vs-th>
                                            </vs-tr>
                                        </template>
                                        <template #tbody>
                                            <template
                                                v-for="file in getFirmwareFiles(project.id)">
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
                                                        <delete-dialog
                                                            :args="[project.id, file]"
                                                            :disabled="projectsLoading || getFirmwareFiles(project.id).length === 1"
                                                            :handle="deleteFirmwareFile">
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
                            </vs-tr>
                        </template>
                    </template>
                </vs-table>
            </template>
        </vse-card>
        <edit-project v-model="editActive" :project="editProject"/>
    </div>
</template>

<script>
import {toNice} from "@themezernx/target-parser/dist";
import editProject from "~/components/editProject";
import deleteDialog from "~/components/deleteDialog.vue";

export default {
    components: {editProject, deleteDialog},
    data: () => ({
        loading: false,
        spinRefreshIcon: false,
        firmwareFiles: [],
        editProject: null,
        editActive: false,
        recentlyDeleted: {},
    }),
    computed: {
        projectsLoading() {
            return this.loading || this.$store.state.projectsLoading || this.firmwareFiles.length === 0;
        },
        projects() {
            const projects = this.$store.state.projects;
            this.firmwareFiles = [];
            projects.forEach((project) => {
                const id = project.id;
                this.$projectManager.firmwareFiles(id).then((files) => {
                    this.firmwareFiles.push({id, files: files});
                });
            });

            return projects;
        },
    },
    watch: {
        firmwareFiles() {
            // TODO, ugly hack. Emit click events on every .vs-table__tr.isExpand.expand element to rerender it
            for (const element of document.getElementsByClassName("vs-table__tr isExpand expand")) {
                element.dispatchEvent(new Event("click"));
                element.dispatchEvent(new Event("click"));
            }
        },
    },
    methods: {
        getFirmwareFiles(id) {
            return this.firmwareFiles.find((f) => f.id === id)?.files || [];
        },
        toNice(filename) {
            return toNice(filename);
        },
        refresh() {
            this.spinRefreshIcon = true;

            this.$projectManager.refresh().then(() => {
                this.spinRefreshIcon = false;
            });
        },
        openInExplorer(projectId) {
            this.$projectManager.openInExplorer(projectId);
        },
        modifyProject(project) {
            this.editProject = project;
            this.editActive = true;
        },
        deleteProject(projectId) {
            // TODO, Ugly fix for the expanded bodies not disappearing
            for (const element of document.getElementsByClassName("vs-table__tr isExpand expand")) {
                element.dispatchEvent(new Event("click"));
            }
            return this.$projectManager.delete(projectId);
        },
        deleteFirmwareFile(projectId, file) {
            return this.$projectManager.deleteFirmwareFile(projectId, file);
        },
    },
    head() {
        const metaTitle = "Projects - SZS Manager";

        return {
            title: metaTitle,
            meta: [
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
}

.center {
    text-align: center;
}
</style>