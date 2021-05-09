export const state = () => ({
    installOnChange: true,
    rebootOnInstall: true,
    switchIp: "",
    switchPort: 5000,
    switchUser: "nxthemer",
    switchPassword: "nxthemer",
});

export const mutations = {
    INSTALL_ON_CHANGE(state: any, value: boolean) {
        state.installOnChange = value;
    },
    REBOOT_ON_INSTALL(state: any, value: boolean) {
        state.rebootOnInstall = value;
    },
    SWITCH_IP(state: any, value: string) {
        state.switchIp = value;
    },
    SWITCH_PORT(state: any, value: number) {
        state.switchPort = value;
    },
    SWITCH_USER(state: any, value: string) {
        state.switchUser = value || "nxthemer";
    },
    SWITCH_PASSWORD(state: any, value: string) {
        state.switchPassword = value || "nxthemer";
    },
};
