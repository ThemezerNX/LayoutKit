export const state = () => ({
    connected: false,
    connecting: false,
    ftpBusy: false,
    activeProject: {id: ""},
    projects: [],
    projectsLoading: false,
    firmwares: [],
    firmwaresLoading: false,
    checkingForToolUpdatesMessage: "",
    pushedInitial: false,
    pushQueue: [],
    pushingChanges: false,
});

export const mutations = {
    CONNECTED(state: any, value: boolean) {
        state.connected = value;
    },
    CONNECTING(state: any, value: boolean) {
        state.connecting = value;
    },
    FTP_BUSY(state: any, value: boolean) {
        state.ftpBusy = value;
    },
    ACTIVE_PROJECT(state: any, value: string) {
        state.activeProject = value || {id: ""};
    },
    PROJECTS(state: any, value: Array<object>) {
        state.projects = value;
    },
    PROJECTS_LOADING(state: any, value: boolean) {
        state.projectsLoading = value;
    },
    FIRMWARES(state: any, value: Array<object>) {
        state.firmwares = value;
    },
    FIRMWARES_LOADING(state: any, value: boolean) {
        state.firmwaresLoading = value;
    },
    CHECKING_FOR_TOOL_UPDATES_MESSAGE(state: any, value: string) {
        state.checkingForToolUpdatesMessage = value;
    },
    ADD_PUSH_QUEUE(state: any, value: string) {
        state.pushQueue.push(value);
    },
    CLEAR_PUSH_QUEUE(state: any) {
        state.pushQueue = [];
    },
    PUSHED_INITIAL(state: any, value: boolean) {
        state.pushedInitial = value;
    },
    PUSHING_CHANGES(state: any, value: boolean) {
        state.pushingChanges = value;
    },
};
