<template>
    <vs-dialog v-model="active" blur>
        <template #header>
            <h3>Create Copy of '{{ projectName }}'</h3>
        </template>
        <form class="form" @submit.prevent="create">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="New Project Name"></vs-input>
        </form>

        <template #footer>
            <vs-button :disabled="!formValid || loading" :loading="loading" block type="submit" @click="create()">
                Create
            </vs-button>
        </template>
    </vs-dialog>
</template>

<script>
export default {
    data: () => ({
        active: false,
        loading: false,
        form: {
            name: "",
        },
    }),
    computed: {
        projectName() {
            return this.$store.state.activeProject.name;
        },
        projectId() {
            return this.$store.state.activeProject.id;
        },
        firmwares() {
            return this.$store.state.firmwares;
        },
        formValid() {
            return this.form.name?.length > 0;
        },
    },
    methods: {
        async create() {
            this.loading = true;
            await this.$projectManager.copyToNew(this.projectId, this.form.name);
            setTimeout(() => {
                this.loading = false;
                this.form.name = "";
                this.active = false;
            }, 500);
        },
    },
};
</script>