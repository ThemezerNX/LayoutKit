<template>
    <vs-dialog v-model="active" not-center not-close prevent-close style="text-align: center" width="550px">
        <template #header>
            <h3 class="mb-0 center">
                Checking For Tool Updates
            </h3>
        </template>

        <div ref="buildLoader" style="height: 250px;"/>

        <template #footer>
            <h4 class="mt-0">
                Please wait...
            </h4>
        </template>
    </vs-dialog>
</template>

<script>
export default {
    data: () => ({
        loader: null,
    }),
    computed: {
        active() {
            return !!this.message;
        },
        message() {
            const message = this.$store.state.checkingForToolUpdatesMessage;

            if (message?.length > 0) {
                if (!this.loader) {
                    this.loader = this.$vs.loading({
                        target: this.$refs.buildLoader,
                        opacity: "0",
                        scale: "1.7",
                    });
                }

                this.loader.changeText(message);
            } else if (this.loader) {
                this.loader.close();
            }

            return message;
        },
    },
};
</script>