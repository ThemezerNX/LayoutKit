export const state = () => ({
    connected: false,
    connecting: false,
    ftpBusy: false,
    activeProject: {id: ""},
    projects: [],
    projectsLoading: false,
    firmwares: [],
    firmwaresLoading: false,
    checkingForToolUpdates: false,
    checkingForToolUpdatesMessage: "",
});

export const mutations = {
    CONNECTED(state: any, value: boolean) {
        state.connected = value;
    },
    CONNECTING(state: any, value: boolean) {
        state.connecting = value;
    },
    FTP_BUSY(state: any, value: boolean) {
        state.awaitingFtpResponse = value;
    },
    ACTIVE_PROJECT(state: any, value: string) {
        state.activeProject = value || {id: ""};
    },
    PROJECTS(state: any, value: Array<object>) {
        console.log("projects:", value.filter(p => !!p));
        state.projects = value;
    },
    PROJECTS_LOADING(state: any, value: boolean) {
        state.projectsLoading = value;
    },
    FIRMWARES(state: any, value: Array<object>) {
        console.log("firmwares:", value.filter(p => !!p));
        state.firmwares = value;
    },
    FIRMWARES_LOADING(state: any, value: boolean) {
        state.firmwaresLoading = value;
    },
    CHECKING_FOR_TOOL_UPDATES(state: any, value: boolean) {
        state.checkingForToolUpdates = value;
    },
    CHECKING_FOR_TOOL_UPDATES_MESSAGE(state: any, value: string) {
        state.checkingForToolUpdatesMessage = value;
    },
};
