<template>
    <vse-card shadow width="100%">
        <template #title>
            <h2>Project Details</h2>
        </template>
        <template #subtitle>
            Last built 5m ago

        </template>
        <template #content>
            <vse-list>
                <vse-list-item>
                    <template #button>
                        <vs-input
                            label-placeholder="Name"
                        />
                    </template>
                </vse-list-item>
                <vse-list-item>
                    <template #button>
                        <vse-spacer/>
                        <vs-button icon @click="openInExplorer()">
                            Open Folder
                            <i class='bx bx-link-external'></i>
                        </vs-button>
                        <vs-tooltip bottom shadow not-hover v-model="deleteTooltip">
                            <vs-button icon danger @click="deleteTooltip = !deleteTooltip">
                                <i class='bx bxs-trash'></i>
                            </vs-button>
                            <template #tooltip>
                                <div class="content-tooltip">
                                    <h4 class="center">
                                        Confirm
                                    </h4>
                                    <p>
                                        Are your sure to move this project and all its files to the trash?
                                    </p>
                                    <footer>
                                        <vs-button @click="deleteTooltip = false; deleteProject()" danger block>
                                            Delete
                                        </vs-button>
                                        <vs-button @click="deleteTooltip = false" dark block>
                                            Cancel
                                        </vs-button>
                                    </footer>
                                </div>
                            </template>
                        </vs-tooltip>
                    </template>
                </vse-list-item>
            </vse-list>
        </template>
    </vse-card>
</template>

<script>
import {shell} from "electron";

export default {
    data: () => ({
        rebootLoading: false,
        deleteTooltip: false,
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
        openInExplorer() {
            shell.openPath("K:/NSW/Themes/Very nice theme");
        },
        deleteProject() {
            // shell.trashItem('');
        }
    },
};
</script>
