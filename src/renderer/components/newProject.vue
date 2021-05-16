<template>
    <vs-dialog v-model="active" :loading="loading">
        <template #header>
            <h3>Create New Project</h3>
        </template>

        <form class="form">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="Project Name"></vs-input>
            <vs-select v-if="active" v-model="form.firmware" :disabled="firmwares.length === 0 || firmwareFilesLoading"
                       :loading="firmwareFilesLoading"
                       block
                       class="project-firmware mb-10"
                       filter
                       placeholder="Firmware Version"
                       @change="getFirmwareFiles()"
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
            <firmware-picker v-model="selectedFirmwareFiles" :firmwareFiles="firmwareFiles"
                             :loading="firmwareFilesLoading"/>
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
import firmwarePicker from "~/components/firmwarePicker.vue";

export default {
    components: {firmwarePicker},
    data: () => ({
        active: false,
        loading: false,
        firmwareFiles: [],
        firmwareFilesLoading: false,
        selectedFirmwareFiles: [],
        form: {
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
                this.form.name = "";
                this.form.firmware = "";
                this.active = false;
            }, 300);
        },
    },
};
</script>