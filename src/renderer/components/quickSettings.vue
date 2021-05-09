<template>
    <vse-card shadow width="100%">
        <template #title>
            <h2>Quick Settings</h2>
        </template>
        <template #content>
            <vse-list>
                <vse-list-item>
                    <template #description>
                        Install on change
                    </template>
                    <template #button>
                        <vs-switch v-model="installOnChange"/>
                    </template>
                </vse-list-item>
                <vse-list-item>
                    <template #description>
                        Reboot on install
                    </template>
                    <template #button>
                        <vs-switch v-model="rebootOnInstall"/>
                    </template>
                </vse-list-item>
                <vse-list-item>
                    <template #description>
                        Restart the console manually
                    </template>
                    <template #button>
                        <vs-button :disabled="rebootLoading || !connected || recentlyClicked" :loading="rebootLoading" class="ma-0"
                                   @click="restartConsole()">Restart
                        </vs-button>
                    </template>
                </vse-list-item>
            </vse-list>
        </template>
    </vse-card>
</template>

<script>
export default {
    data: () => ({
        rebootLoading: false,
        recentlyClicked: false,
    }),
    computed: {
        connected() {
            return !this.$store.state.connecting && this.$store.state.connected;
        },
        installOnChange: {
            get() {
                return this.$store.state.quickSettings.installOnChange;
            },
            set(value) {
                this.$store.commit("settings/INSTALL_ON_CHANGE", value);
            },
        },
        rebootOnInstall: {
            get() {
                return this.$store.state.quickSettings.rebootOnInstall;
            },
            set(value) {
                this.$store.commit("settings/REBOOT_ON_INSTALL", value);
            },
        },
    },
    methods: {
        restartConsole() {
            this.rebootLoading = true;
            // Do this so that the button stays disabled in the time the disconnect hasn't been noticed yet.
            this.recentlyClicked = true;
            setTimeout(() => {
                this.recentlyClicked = false;
            }, 5000);

            this.$ftpController.reboot().then(() => {
                this.rebootLoading = false;
            });
        },
    },
};
</script>
