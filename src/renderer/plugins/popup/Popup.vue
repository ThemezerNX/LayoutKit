<template>
    <vs-dialog width="550px" not-center v-model="popup">
        <template v-if="error" #header>
            <h4 class="mb-0" :style="!!error ? `color: rgb(${color});` : ''">
                An Error Occurred
            </h4>
        </template>

        <span>
            {{ error || message }}
        </span>
    </vs-dialog>
</template>

<script>
export default {
    data: () => ({
        popup: false,
        color: null,
    }),
    computed: {
        message() {
            return this.$store.state.popup?.message;
        },
        error() {
            return this.$store.state.popup?.error;
        },
    },
    watch: {
        message(n) {
            if (n && n !== "") {
                this.color = "";
                this.popup = true;
            } else
                this.popup = false;
        },
        error(n) {
            if (n && n !== "") {
                this.color = "var(--vs-warn)";
                this.popup = true;
            } else this.popup = false;
        },
    },
};
</script>