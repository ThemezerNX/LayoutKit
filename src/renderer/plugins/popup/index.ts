import Vue from "vue";
import popup from "./Popup.vue";

export default (context: any, inject: any) => {
    const storeModule = {
        namespaced: true,
        state: () => ({
            message: null,
            error: null,
        }),
        mutations: {
            SET_MESSAGE(state: any, message: string) {
                state.message = message;
            },
            SET_ERROR(state: any, error: string) {
                state.error = error;
            },
        },
    };

    context.store.registerModule("popup", storeModule);

    const $popup = {
        message(message: string) {
            context.store.commit("popup/SET_MESSAGE", message);
        },
        error(error: Error) {
            context.store.commit("popup/SET_ERROR", error.message);
        },
    };

    inject("popup", $popup);
    context.$popup = $popup;

    Vue.component("popup", popup);
}
