<template>
    <vs-dialog v-model="active" blur>
        <template #header>
            <h3>Import New Firmware</h3>
        </template>

        <p class="mt-0 mb-20">
            Copy the <i>MicroSD:/themes/systemData</i> folder<br>
            to your computer. Select the <i>ver.cfg</i> file here:
        </p>

        <form class="form">
            <div @click="selectCfgFile()">
                <vs-input v-model="cfgPath" block class="file-select mb-10" label-placeholder="ver.cfg Path"
                          readonly></vs-input>
            </div>
            <div class="version">
                <vs-input v-model="form.major" block class="version-field mb-10" label="Version" placeholder="major"
                          type="number"
                >
                    <template v-if="form.major < 0" #message-warn>
                        Must be positive
                    </template>
                </vs-input>
                <h2>.</h2>
                <vs-input v-model="form.minor" block class="version-field mb-10" placeholder="minor"
                          type="number">
                    <template v-if="form.minor < 0" #message-warn>
                        Must be positive
                    </template>
                </vs-input>
                <h2>.</h2>
                <vs-input v-model="form.patch" block class="version-field mb-10" placeholder="patch"
                          type="number">
                    <template v-if="firmwares.includes(versionString)" #message-danger>
                        Version already exists
                    </template>
                    <template v-if="form.patch < 0" #message-warn>
                        Must be positive
                    </template>
                </vs-input>
            </div>
        </form>

        <template #footer>
            <p class="mt-0">Files will be copied, not moved</p>
            <vs-button :disabled="!formValid || loading" :loading="loading" block type="submit" @click="create()">
                Import
            </vs-button>
        </template>
    </vs-dialog>
</template>

<script>
import * as fs from "fs";

export default {
    data: () => ({
        active: false,
        loading: false,
        cfgPath: "",
        form: {
            major: undefined,
            minor: undefined,
            patch: undefined,
        },
    }),
    computed: {
        firmwares() {
            return this.$store.state.firmwares;
        },
        formValid() {
            return this.cfgPath?.length > 0
                && this.form.major >= 0
                && this.form.minor >= 0
                && this.form.patch >= 0
                && !this.firmwares.includes(this.versionString);
        },
        versionString() {
            return this.form.major + "." + this.form.minor + "." + this.form.patch;
        },
    },
    watch: {
        cfgPath(newValue) {
            if (newValue?.length > 0) {
                fs.readFile(newValue, "utf8", (err, contents) => {
                    if (err) return console.log(err);
                    const parts = contents.split(".");
                    this.form.major = parts[0];
                    this.form.minor = parts[1];
                    this.form.patch = parts[2];
                });
            }
        },
    },
    methods: {
        selectCfgFile() {
            this.$ipcService.fs.selectCfgFile().then((path) => {
                if (path?.length > 0) {
                    this.cfgPath = path[0];
                }
            });
        },
        async create() {
            this.loading = true;
            const directory = this.cfgPath.match(/(.*)[\/\\]/)[1];
            await this.$firmwareManager.import(directory);
            setTimeout(() => {
                this.loading = false;
                this.cfgPath = "";
                this.form.major = undefined;
                this.form.minor = undefined;
                this.form.patch = undefined;
                this.active = false;
            }, 500);
        },
    },
};
</script>

<style lang="scss" scoped>
.file-select {
    cursor: pointer !important;
}

.version {
    display: flex;
    justify-content: space-evenly;

    .version-field {
        width: 118px;
    }
}
</style>