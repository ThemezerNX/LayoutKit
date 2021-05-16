<template>
    <vs-dialog v-model="active" :loading="firmwareFilesLoading">
        <template v-if="active" #header>
            <h3>Edit {{ project.name }}</h3>
        </template>

        <form class="form">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="Project Name"/>
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
        active: false,
        loading: false,
        firmwareFiles: [],
        firmwareFilesLoading: false,
        selectedFirmwareFiles: [],
        form: {
            name: "",
        },
    }),
    computed: {
        project() {
            const project = this.$store.state.activeProject;
            this.form.name = project.name;
            this.getFirmwareFiles(project);

            return project;
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
        getFirmwareFiles(project) {
            this.firmwareFiles = [];
            this.firmwareFilesLoading = true;
            this.$firmwareManager.firmwareFiles(project.firmware).then((newFiles) => {
                this.$projectManager.firmwareFiles(project.id).then((existingFiles) => {
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
                this.selectedFirmwareFiles = [];
                this.active = false;
            }, 300);
        },
    },
};
</script>