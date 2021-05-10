export const state = () => ({
    installOnChange: true,
    rebootOnInstall: true,
    ftpIp: undefined,
    ftpPort: 5000,
    ftpUsername: "nxthemer",
    ftpPassword: "nxthemer",
});

export const mutations = {
    INSTALL_ON_CHANGE(state: any, value: boolean) {
        state.installOnChange = value;
    },
    REBOOT_ON_INSTALL(state: any, value: boolean) {
        state.rebootOnInstall = value;
    },
    FTP_IP(state: any, value: string) {
        state.ftpIp = value;
    },
    FTP_PORT(state: any, value: number) {
        state.ftpPort = value;
    },
    FTP_USERNAME(state: any, value: string) {
        state.ftpUsername = value || "nxthemer";
    },
    FTP_PASSWORD(state: any, value: string) {
        state.ftpPassword = value || "nxthemer";
    },
};
