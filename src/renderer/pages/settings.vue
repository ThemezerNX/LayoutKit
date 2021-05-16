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
                                    v-model="ftpIp"
                                    placeholder="IP Address (e.g. 192.168.1.12)"
                                    type="text"
                                >
                                    <template v-if="!validation.ftpIpValid" #message-danger>
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
                                    v-model="ftpPort"
                                    placeholder="Port (e.g. 5000)"
                                    type="number"
                                >
                                    <template v-if="!validation.ftpPortValid" #message-danger>
                                        Invalid Port
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                        <vse-list-item>
                            <template #description>
                                Username
                            </template>
                            <template #button>
                                <vs-input
                                    v-model="ftpUsername"
                                    placeholder="Username (nxthemer)"
                                    type="text"
                                >
                                    <template v-if="!validation.ftpUsernameValid" #message-danger>
                                        Invalid Username
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                        <vse-list-item>
                            <template #description>
                                Password
                            </template>
                            <template #button>
                                <vs-input
                                    v-model="ftpPassword"
                                    placeholder="Password (nxthemer)"
                                    type="text"
                                >
                                    <template v-if="!validation.ftpPasswordValid" #message-danger>
                                        Invalid Password
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                        <h3>Updates</h3>
                        <vse-list-item>
                            <template #description>
                                Check for and download tool updates on launch
                            </template>
                            <template #button>
                                <vs-switch v-model="checkToolUpdatesOnLaunch"/>
                            </template>
                        </vse-list-item>
                    </vse-list>
                </template>
            </vse-card>
        </vs-col>
        <vse-footer class="px-10" fixed shadow style="height: 84px">
            <p class="center">
                Made with ❤️ by ThemezerNX
            </p>
            <p class="center">
                Source code available on <a href="#" @click="openSource">GitHub</a>
            </p>
        </vse-footer>
    </vs-row>
</template>

<script>
export default {
    data: () => ({
        darkTheme: true,
        ftpIp: undefined,
        ftpPort: undefined,
        ftpUsername: undefined,
        ftpPassword: undefined,
        validation: {
            ftpIpValid: true,
            ftpPortValid: true,
            ftpUsernameValid: true,
            ftpPasswordValid: true,
        },
    }),
    mounted() {
        if (localStorage.vsTheme !== "dark") {
            this.darkTheme = false;
        }
        this.ftpIp = this.$store.state.settings.ftpIp;
        this.ftpPort = this.$store.state.settings.ftpPort;
        this.ftpUsername = this.$store.state.settings.ftpUsername;
        this.ftpPassword = this.$store.state.settings.ftpPassword;
    },
    watch: {
        ftpIp(value) {
            if (/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/.test(value)) {
                this.$store.commit("settings/FTP_IP", value);
                this.validation.ftpIpValid = true;
            } else {
                this.validation.ftpIpValid = false;
            }
            this.$ftpController.disconnect();
        },
        ftpPort(value) {
            if (value > 0 && value <= 65535) {
                this.$store.commit("settings/FTP_PORT", value);
                this.validation.ftpPortValid = true;
            } else {
                this.validation.ftpPortValid = false;
            }
            this.$ftpController.disconnect();
        },
        ftpUsername(value) {
            if (value?.length > 0) {
                this.$store.commit("settings/FTP_USERNAME", value);
                this.validation.ftpUsernameValid = true;
            } else {
                this.validation.ftpUsernameValid = false;
            }
            this.$ftpController.disconnect();
        },
        ftpPassword(value) {
            if (value?.length > 0) {
                this.$store.commit("settings/FTP_PASSWORD", value);
                this.validation.ftpPasswordValid = true;
            } else {
                this.validation.ftpPasswordValid = false;
            }
            this.$ftpController.disconnect();
        },
    },
    computed: {
        checkToolUpdatesOnLaunch: {
            get() {
                return this.$store.state.settings.checkToolUpdatesOnLaunch;
            },
            set(value) {
                this.$store.commit("settings/CHECK_TOOL_UPDATES_ON_LAUNCH", value);
            },
        },
    },
    methods: {
        openSource(event) {
            event.preventDefault();
            this.$ipcService.system.openUrl("https://github.com/ThemezerNX/LayoutKit");
        },
    },
    head() {
        const metaTitle = "Settings";

        return {
            title: metaTitle,
            meta: [
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
</style>