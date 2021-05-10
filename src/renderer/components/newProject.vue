<template>
    <vs-dialog v-model="active" blur>
        <template #header>
            <h3>Create New Project</h3>
        </template>

        <form class="form">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="Project Name"></vs-input>
            <vs-select v-if="active" v-model="form.firmware" :disabled="firmwares.length === 0 || firmwareFilesLoading"
                       block
                       class="project-firmware mb-10"
                       filter
                       placeholder="Firmware Version"
                       @change="getFirmwareFiles()"
                       :loading="firmwareFilesLoading"
            >
                <template v-for="firmware in firmwares">
                    <vs-option
                        :key="firmware"
                        :label="firmware"
                        :value="firmware"
                    >
                        {{ firmware }}
                    </vs-option>
                </template>
                <template v-if="firmwares.length === 0" #message-danger>
                    No firmwares configured. Go to
                    <nuxt-link to="/szs-manager/firmwares"><i>SZS Manager > Firmwares</i></nuxt-link>
                    and add one first.
                </template>
            </vs-select>
            <vs-table
                v-model="selectedFirmwareFiles"
                :disabled="firmwareFiles.length === 0"
                :loading="firmwareFilesLoading"
            >
                <template #thead>
                    <vs-tr>
                        <vs-th class="checkbox-column">
                            <vs-checkbox
                                class="checkbox"
                                :indeterminate="selectedFirmwareFiles.length > 0 && selectedFirmwareFiles.length < firmwareFiles.length"
                                :checked-force="selectedFirmwareFiles.length > 0 && selectedFirmwareFiles.length === firmwareFiles.length"
                                v-model="form.allChecked"
                                @change="selectedFirmwareFiles = $vs.checkAll(selectedFirmwareFiles, firmwareFiles)"
                            />
                        </vs-th>
                        <vs-th>
                            Menu
                        </vs-th>
                        <vs-th>
                            Filename
                        </vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <template v-for="file in firmwareFiles">
                        <vs-tr
                            :key="file"
                            :data="file"
                            :is-selected="!!selectedFirmwareFiles.includes(file)"
                        >
                            <vs-td checkbox class="checkbox-column">
                                <vs-checkbox class="checkbox" :val="file"
                                             v-model="selectedFirmwareFiles"/>
                            </vs-td>
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
        </form>

        <template #footer>
            <vs-button :disabled="!formValid || loading" :loading="loading" block type="submit" @click="create()">
                Create
            </vs-button>
        </template>
    </vs-dialog>
</template>

<script>
import {toNice} from "@themezernx/target-parser/dist";

export default {
    data: () => ({
        active: false,
        loading: false,
        firmwareFiles: [],
        firmwareFilesLoading: false,
        selectedFirmwareFiles: [],
        form: {
            allChecked: false,
            name: "",
            firmware: "",
        },
    }),
    computed: {
        firmwares() {
            return this.$store.state.firmwares;
        },
        formValid() {
            return this.form.name?.length > 0
                && this.form.firmware?.length > 0
                && this.selectedFirmwareFiles.length > 0;
        },
    },
    methods: {
        toNice(filename) {
            return toNice(filename);
        },
        getFirmwareFiles() {
            this.firmwareFilesLoading = true;
            this.$firmwareManager.firmwareFiles(this.form.firmware).then((files) => {
                this.firmwareFiles = files;
                this.firmwareFilesLoading = false;
            });
        },
        async create() {
            this.loading = true;
            await this.$projectManager.createNew(this.form.name, this.form.firmware, this.selectedFirmwareFiles);
            setTimeout(() => {
                this.loading = false;
                this.firmwareFiles = [];
                this.selectedFirmwareFiles = [];
                this.form.allChecked = false;
                this.form.name = "";
                this.form.firmware = "";
                this.active = false;
            }, 500);
        },
    },
};
</script>

<style lang="scss" scoped>
.checkbox-column {
    width: 50px !important;
}

.checkbox {
    width: fit-content;
    margin: auto;
}
</style>