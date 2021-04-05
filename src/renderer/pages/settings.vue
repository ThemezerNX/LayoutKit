<template xmlns="">
    <vs-row>
        <vs-col>
            <vse-card shadow max-width="900px">
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
                                <vs-switch class="ma-5" v-model="darkTheme" @input="$vs.toggleTheme()">
                                    <template #circle>
                                        <i v-if="darkTheme" class='bx bxs-moon'></i>
                                        <i v-else class='bx bxs-sun'></i>
                                    </template>
                                </vs-switch>
                            </template>
                        </vse-list-item>
                        <vse-list-item>
                            <template #description>
                                Switch sys-ftpd IP Address
                            </template>
                            <template #button>
                                <vs-input
                                    v-model="switchIP"
                                    placeholder="IP Address (e.g. 192.168.1.12)"
                                >
                                    <template v-if="!switchIPValid" #message-danger>
                                        Invalid IP
                                    </template>
                                </vs-input>
                            </template>
                        </vse-list-item>
                        <vse-list-item>
                            <template #description>
                                Switch sys-ftpd Port
                            </template>
                            <template #button>
                                <vs-input
                                    type="number"
                                    v-model="switchPort"
                                    placeholder="Port (e.g. 5000)"
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
        <vse-footer fixed shadow style="height: 84px">

        </vse-footer>
    </vs-row>
</template>

<script>
export default {
    data: () => ({
        darkTheme: true,
        switchIPValid: true,
        switchPortValid: true,
    }),
    mounted() {
        if (localStorage.vsTheme !== "dark") {
            this.darkTheme = false;
        }
    },
    computed: {
        switchIP: {
            get() {
                return this.$store.state.switchIP;
            },
            set(value) {
                if (/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/.test(value)) {
                    this.$store.commit("SWITCH_IP", value);
                    this.switchIPValid = true;
                } else {
                    this.switchIPValid = false;
                }
            },
        },
        switchPort: {
            get() {
                return this.$store.state.switchPort;
            },
            set(value) {
                if (value > 0 && value <= 65535) {
                    this.$store.commit("SWITCH_PORT", value);
                    this.switchPortValid = true;
                } else {
                    this.switchPortValid = false;
                }
            },
        },
    },
};
</script>