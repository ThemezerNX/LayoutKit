export const state = () => ({
    lastSelectedProject: "",
    switchIP: "",
    switchPort: 5000,
});

export const mutations = {
    LAST_SELECTED_PROJECT(state: any, value: string) {
        state.lastSelectedProject = value;
    },
    SWITCH_IP(state: any, value: string) {
        state.switchIP = value;
    },
    SWITCH_PORT(state: any, value: number) {
        state.switchPort = value;
    },
};
