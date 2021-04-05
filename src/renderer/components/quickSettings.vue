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
                        <vs-button class="ma-0" @click="restartConsole()" :loading="rebootLoading" :disabled="rebootLoading">Restart</vs-button>
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
    }),
    computed: {
        installOnChange: {
            get() {
                return this.$store.state.quickSettings.installOnChange;
            },
            set(value) {
                this.$store.commit("quickSettings/INSTALL_ON_CHANGE", value);
            },
        },
        rebootOnInstall: {
            get() {
                return this.$store.state.quickSettings.rebootOnInstall;
            },
            set(value) {
                this.$store.commit("quickSettings/REBOOT_ON_INSTALL", value);
            },
        },
    },
    methods: {
        restartConsole() {
            this.rebootLoading = true;
            setTimeout(() => {
                this.rebootLoading = false;
            }, 5000);
        },
    },
};
</script>
