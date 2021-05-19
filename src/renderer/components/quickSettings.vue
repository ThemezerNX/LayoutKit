<template>
    <vse-card shadow width="100%">
        <template #title>
            <h2>Quick Settings</h2>
        </template>
        <template #content>
            <vse-list>
                <vse-list-item>
                    <template #description>
                        Install changes ({{
                            pushedInitial ? pushQueue.length : (activeProjectId && activeProjectId.length > 0 ? "initial" : "none")
                        }})
                    </template>
                    <template #button>
                        <vs-button
                            :disabled="installLoading || pushingChanges || rebootLoading || !connected || installRecentlyClicked || restartRecentlyClicked || (pushQueue.length === 0 && pushedInitial) || !(activeProjectId && activeProjectId.length > 0)"
                            :loading="installLoading || pushingChanges"
                            class="ma-0"
                            @click="installOnConsole()">
                            Install
                        </vs-button>
                    </template>
                </vse-list-item>
                <vse-list-item>
                    <template #description>
                        Restart the console
                    </template>
                    <template #button>
                        <vs-button :disabled="rebootLoading || !connected || restartRecentlyClicked"
                                   :loading="rebootLoading"
                                   class="ma-0"
                                   @click="restartConsole()">
                            Restart
                        </vs-button>
                    </template>
                </vse-list-item>
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
            </vse-list>
        </template>
    </vse-card>
</template>

<script>
export default {
    data: () => ({
        installLoading: false,
        rebootLoading: false,
        installRecentlyClicked: false,
        restartRecentlyClicked: false,
    }),
    computed: {
        connected() {
            return !this.$store.state.connecting && this.$store.state.connected;
        },
        pushingChanges() {
            return this.$store.state.pushingChanges;
        },
        pushedInitial() {
            return this.$store.state.pushedInitial;
        },
        pushQueue() {
            return this.$store.state.pushQueue;
        },
        activeProjectId() {
            return this.$store.state.activeProject.id;
        },
        installOnChange: {
            get() {
                return this.$store.state.settings.installOnChange;
            },
            set(value) {
                this.$store.commit("settings/INSTALL_ON_CHANGE", value);
            },
        },
        rebootOnInstall: {
            get() {
                return this.$store.state.settings.rebootOnInstall;
            },
            set(value) {
                this.$store.commit("settings/REBOOT_ON_INSTALL", value);
            },
        },
    },
    methods: {
        installOnConsole() {
            this.installLoading = true;
            // Do this so that the button stays disabled in the time the disconnect hasn't been noticed yet.
            this.installRecentlyClicked = true;
            setTimeout(() => {
                this.installRecentlyClicked = false;
            }, 5000);

            this.$projectManager.installQueue().then(() => {
                this.installLoading = false;
            });
        },
        restartConsole() {
            this.rebootLoading = true;
            // Do this so that the button stays disabled in the time the disconnect hasn't been noticed yet.
            this.restartRecentlyClicked = true;
            setTimeout(() => {
                this.restartRecentlyClicked = false;
            }, 5000);

            this.$ftpController.reboot().then(() => {
                this.rebootLoading = false;
            });
        },
    },
};
</script>
