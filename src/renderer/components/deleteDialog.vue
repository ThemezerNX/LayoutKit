<template>
    <vs-tooltip v-model="active" bottom not-hover shadow>
        <vs-button danger icon @click="active = !active">
            <i class='bx bxs-trash'></i>
        </vs-button>
        <template #tooltip>
            <div class="content-tooltip">
                <h4 class="center">
                    Confirm
                </h4>
                <p>
                    Are your sure to move this
                    <slot name="dataType"/>
                    and all its files to the trash?
                </p>
                <footer>
                    <vs-button :disabled="loading" :loading="loading" block danger @click="del()">
                        Delete
                    </vs-button>
                    <vs-button :disabled="loading" block dark @click="active = false">
                        Cancel
                    </vs-button>
                </footer>
            </div>
        </template>
    </vs-tooltip>
</template>

<script>
export default {
    data: () => ({
        active: false,
        loading: false,
    }),
    props: {
        value: {
            type: String,
            required: false,
        },
        handle: {
            type: Function,
            required: true,
        },
    },
    methods: {
        del() {
            this.loading = true;
            this.handle(this.value).then(() => {
                this.loading = false;
                this.active = false;
            });
        },
    },
};
</script>
