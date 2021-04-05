export const state = () => ({
    installOnChange: true,
    rebootOnInstall: true,
});

export const mutations = {
    INSTALL_ON_CHANGE(state: any, value: boolean) {
        state.installOnChange = value;
    },
    REBOOT_ON_INSTALL(state: any, value: boolean) {
        state.rebootOnInstall = value;
    },
};
