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
                                    <vs-button :disabled="firmwaresLoading" icon @click="openInExplorer(version)">
                                        Open Folder
                                        <i class='bx bx-link-external'></i>
                                    </vs-button>
                                    <delete-dialog :disabled="firmwaresLoading" :handle="deleteFirmware" :value="version">
                                        <template #dataType>
                                            firmware
                                        </template>
                                    </delete-dialog>
                                </vs-td>
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

export default {
    components: {deleteDialog, newFirmware},
    data: () => ({
        spinRefreshIcon: false,
    }),
    computed: {
        firmwaresLoading() {
            return this.$store.state.firmwaresLoading;
        },
        firmwares() {
            return this.$store.state.firmwares;
        },
    },
    methods: {
        refresh() {
            if (!this.firmwaresLoading) {
                this.spinRefreshIcon = true;
                setTimeout(() => {
                    this.spinRefreshIcon = false;
                }, 500);
            }

            this.$firmwareManager.refresh();
        },
        openInExplorer(version) {
            this.$firmwareManager.openInExplorer(version);
        },
        deleteFirmware(version) {
            return this.$firmwareManager.delete(version);
        },
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