<template>
    <vs-tooltip v-model="active" bottom not-hover shadow>
        <vs-button :disabled="disabled" danger icon @click.stop="active = !active">
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
                    <vs-button :disabled="loading || disabled" :loading="loading" block danger @click.stop="del()">
                        Delete
                    </vs-button>
                    <vs-button :disabled="loading || disabled" block dark @click.stop="active = false">
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
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        args: {
            type: Array,
            required: false,
            default: () => [],
        },
        handle: {
            type: Function,
            required: true,
        },
        callback: {
            type: Function,
            required: false,
        },
    },
    methods: {
        del() {
            this.loading = true;
            console.log("requesting");
            this.handle(...this.args).then(() => {
                console.log("finished");
                this.loading = false;
                this.active = false;
                if (this.callback) this.callback();
            });
        },
    },
};
</script>
