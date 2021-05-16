<template>
    <vs-dialog v-model="active" :loading="firmwareFilesLoading">
        <template v-if="active" #header>
            <h3>Edit {{ project.name }}</h3>
        </template>

        <form class="form">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="Project Name"></vs-input>
            <firmware-picker v-model="selectedFirmwareFiles" :firmwareFiles="firmwareFiles"
                             :loading="firmwareFilesLoading"/>
        </form>

        <template #footer>
            <vs-button :disabled="!formValid || loading" :loading="loading" block type="submit" @click="save()">
                Save
            </vs-button>
        </template>
    </vs-dialog>
</template>

<script>
import {toNice} from "@themezernx/target-parser/dist";
import FirmwarePicker from "~/components/firmwarePicker.vue";

export default {
    components: {FirmwarePicker},
    data: () => ({
        loading: false,
        firmwareFiles: [],
        firmwareFilesLoading: false,
        selectedFirmwareFiles: [],
        form: {
            name: "",
        },
    }),
    props: {
        value: {
            type: Boolean,
            required: false,
            default: false,
        },
        project: {
            type: Object | null,
            required: true,
        },
    },
    watch: {
        project(project) {
            this.form.name = project.name;
            this.getFirmwareFiles();
        },
    },
    computed: {
        active: {
            get() {
                return this.value;
            },
            set(status) {
                this.$emit("input", status);
            },
        },
        formValid() {
            return this.form.name?.length > 0 &&
                (this.form.name !== this.project.name || this.selectedFirmwareFiles.length > 0);
        },
    },
    methods: {
        toNice(filename) {
            return toNice(filename);
        },
        getFirmwareFiles() {
            this.firmwareFiles = [];
            this.firmwareFilesLoading = true;
            this.$firmwareManager.firmwareFiles(this.project.firmware).then((newFiles) => {
                this.$projectManager.firmwareFiles(this.project.id).then((existingFiles) => {
                    this.firmwareFiles = newFiles.filter((nf) => !existingFiles.includes(nf));
                    this.firmwareFilesLoading = false;
                });
            });
        },
        async save() {
            this.loading = true;
            this.$projectManager.setName(this.project.id, this.form.name);
            await this.$projectManager.addNewFirmwareFiles(this.project.id, this.project.firmware, this.selectedFirmwareFiles);

            setTimeout(() => {
                this.loading = false;
                this.firmwareFiles = [];
                this.selectedFirmwareFiles = [];
                this.form.name = "";
                this.active = false;
            }, 300);
        },
    },
};
</script>