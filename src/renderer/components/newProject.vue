<template>
    <vs-dialog v-model="active" blur>
        <template #header>
            <h3>Create New Project</h3>
        </template>

        <form class="form">
            <vs-input v-model="form.name" block class="project-name mb-10" placeholder="Project Name"></vs-input>
            <vs-select v-if="active" v-model="form.firmware" :disabled="firmwares.length === 0" block class="project-firmware mb-10"
                       filter
                       placeholder="Firmware Version"
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
            firmware: "",
        },
    }),
    computed: {
        firmwares() {
            return this.$store.state.firmwares;
        },
        formValid() {
            return this.form.name?.length > 0
                && this.form.firmware?.length > 0;
        },
    },
    methods: {
        async create() {
            this.loading = true;
            await this.$projectManager.createNew(this.form.name, this.form.firmware);
            setTimeout(() => {
                this.loading = false;
                this.form.name = "";
                this.form.firmware = "";
                this.active = false;
            }, 500);
        },
    },
};
</script>