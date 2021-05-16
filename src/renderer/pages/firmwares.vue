<template>
    <div>
        <vse-card flex max-width="900px" shadow>
            <template #title>
                <h1>Firmwares</h1>
                <vse-spacer/>
                <vs-button :disabled="firmwaresLoading" icon @click="$refs['newFirmwareDialog'].active = true">
                    <i class='bx bx-import'></i> Import
                </vs-button>
                <vs-button
                    :disabled="firmwaresLoading"
                    icon
                    right
                    @click="refresh()"
                >
                    <i :class="{spin: spinRefreshIcon}" class='bx bx-refresh'></i>
                </vs-button>
            </template>
            <template #content>
                <vs-table :disabled="firmwaresLoading">
                    <template #thead>
                        <vs-tr>
                            <vs-th>
                                Version
                            </vs-th>
                            <vs-th style="width: 200px;">
                                Actions
                            </vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <template v-for="version in firmwares">
                            <vs-tr :key="version">
                                <vs-td>
                                    <h2 class="ma-0">{{ version }}</h2>
                                </vs-td>
                                <vs-td class="actions">
                                    <vs-button :disabled="firmwaresLoading" icon
                                               @click.stop="openInExplorer(version)">
                                        Open Folder
                                        <i class='bx bx-link-external'></i>
                                    </vs-button>
                                    <delete-dialog :args="[version]" :disabled="firmwaresLoading"
                                                   :handle="deleteFirmware">
                                        <template #dataType>
                                            firmware
                                        </template>
                                    </delete-dialog>
                                </vs-td>

                                <template v-if="getFirmwareFiles(version).length > 0" #expand>
                                    <vs-table>
                                        <template #thead>
                                            <vs-tr>
                                                <vs-th>
                                                    Menu
                                                </vs-th>
                                                <vs-th>
                                                    Filename
                                                </vs-th>
                                            </vs-tr>
                                        </template>
                                        <template #tbody>
                                            <template
                                                v-for="file in getFirmwareFiles(version)">
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
        <new-firmware ref="newFirmwareDialog"/>
    </div>
</template>

<script>
import deleteDialog from "~/components/deleteDialog.vue";
import newFirmware from "~/components/newFirmware.vue";
import {toNice} from "@themezernx/target-parser/dist";

export default {
    components: {deleteDialog, newFirmware},
    data: () => ({
        spinRefreshIcon: false,
        firmwareFiles: [],
    }),
    computed: {
        firmwaresLoading() {
            return this.$store.state.firmwaresLoading || this.firmwareFiles.length === 0;
        },
        firmwares() {
            const versions = this.$store.state.firmwares;
            versions.forEach((version) => {
                this.$firmwareManager.firmwareFiles(version).then((files) => {
                    this.firmwareFiles.push({version, files: files});
                });
            });

            return versions;
        },
    },
    methods: {
        getFirmwareFiles(version) {
            return this.firmwareFiles.find((f) => f.version === version)?.files || [];
        },
        toNice(filename) {
            return toNice(filename);
        },
        refresh() {
            this.firmwareFiles = [];
            this.spinRefreshIcon = true;

            this.$firmwareManager.refresh().then(() => {
                this.spinRefreshIcon = false;
            });
        },
        openInExplorer(version) {
            this.$firmwareManager.openInExplorer(version);
        },
        deleteFirmware(version) {
            // TODO, Ugly fix for the expanded bodies not disappearing
            for (const element of document.getElementsByClassName("vs-table__tr isExpand expand")) {
                element.dispatchEvent(new Event("click"));
            }
            return this.$firmwareManager.delete(version);
        },
    },
    head() {
        const metaTitle = "Firmwares";

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