<template>
    <vs-dialog v-model="active" not-center width="550px">
        <template v-if="error" #header>
            <h3 :style="!!error ? `color: rgb(${color});` : ''" class="mb-0">
                An Error Occurred
            </h3>
        </template>

        <span>
            {{ error || message }}
        </span>
    </vs-dialog>
</template>

<script>
export default {
    data: () => ({
        active: false,
        color: null,
    }),
    computed: {
        message() {
            return this.$store.state.popupState?.message;
        },
        error() {
            return this.$store.state.popupState?.error;
        },
    },
    watch: {
        message(n) {
            if (n && n !== "") {
                this.color = "";
                this.active = true;
            } else
                this.active = false;
        },
        error(n) {
            if (n && n !== "") {
                this.color = "var(--vs-danger)";
                this.active = true;
            } else this.active = false;
        },
    },
};
</script>