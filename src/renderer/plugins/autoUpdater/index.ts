import Vue from "vue";
import autoUpdater from "./autoUpdater.vue";
import {ipcRenderer} from "electron";

export default (context: any) => {
    const storeModule = {
        namespaced: true,
        state: () => ({
            message: null,
        }),
        mutations: {
            SET_MESSAGE(state: any, message: string) {
                state.message = message;
            },
        },
    };
    context.store.registerModule("autoUpdater", storeModule);
    // Reset vuex persistent
    context.store.commit("autoUpdater/SET_MESSAGE", null);

    ipcRenderer.on("updateAvailable", () => {
        context.store.commit("autoUpdater/SET_MESSAGE", "Downloading update...");
    });

    ipcRenderer.on("updateDownloaded", () => {
        context.store.commit("autoUpdater/SET_MESSAGE", "Done! Restarting now...");
        setTimeout(() => {
            context.$ipcService.system.quitAndInstallUpdate();
        }, 2000);
    });

    Vue.component("autoUpdater", autoUpdater);
}
