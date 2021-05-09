<template>
    <vs-row>
        <vs-col>
            <vse-card max-width="900px" shadow>
                <template #title>
                    <h1>Settings</h1>
                </template>
                <template #content>
                    <vse-list>
                        <vse-list-item>
                            <template #description>
                                Dark Theme
                            </template>
                            <template #button>
                                <vs-switch v-model="darkTheme" class="ma-5" @input="$vs.toggleTheme()">
                                    <template #circle>
                                        <i v-if="darkTheme" class='bx bxs-moon'></i>
                                        <i v-else class='bx bxs-sun'></i>
                                    </template>
                                </vs-switch>
                            </template>
                        </vse-list-item>
                        <h3>Switch sys-ftpd</h3>
                        <vse-list-item>
                            <template #description>
                                IP Address
                            </template>
                            <template #button>
                                <vs-input
                                    v-model="switchIp"
                                    placeholder="IP Address (e.g. 192.168.1.12)"
                                >
                                    <template v-if="!switchIpValid" #message-danger>
                                        Invalid IP
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                        <vse-list-item>
                            <template #description>
                                Port
                            </template>
                            <template #button>
                                <vs-input
                                    v-model="switchPort"
                                    placeholder="Port (e.g. 5000)"
                                    type="number"
                                >
                                    <template v-if="!switchPortValid" #message-danger>
                                        Invalid Port
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                    </vse-list>
                </template>
            </vse-card>
        </vs-col>
        <vse-footer class="px-10" fixed shadow style="height: 84px">
            <p class="center">
                Created with ❤️ by Migush
            </p>
            <p class="center">
                Source code available on <a href="https://github.com/ThemezerNX/LayoutKit" target="_blank">GitHub</a>
            </p>
        </vse-footer>
    </vs-row>
</template>

<script>
export default {
    data: () => ({
        darkTheme: true,
        switchIpValid: true,
        switchPortValid: true,
    }),
    mounted() {
        if (localStorage.vsTheme !== "dark") {
            this.darkTheme = false;
        }
    },
    computed: {
        switchIp: {
            get() {
                return this.$store.state.settings.switchIp;
            },
            set(value) {
                if (/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/.test(value)) {
                    this.$store.commit("settings/SWITCH_IP", value);
                    this.switchIpValid = true;
                } else {
                    this.switchIpValid = false;
                }
                this.$ftpController.disconnect();
            },
        },
        switchPort: {
            get() {
                return this.$store.state.settings.switchPort;
            },
            set(value) {
                if (value > 0 && value <= 65535) {
                    this.$store.commit("settings/SWITCH_PORT", value);
                    this.switchPortValid = true;
                } else {
                    this.switchPortValid = false;
                }
                this.$ftpController.disconnect();
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
</style>