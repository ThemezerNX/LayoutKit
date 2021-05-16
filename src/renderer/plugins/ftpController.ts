// This file should contain all stuff related to rebooting and uploading.
import * as ftp from "basic-ftp";

export default (context: any, inject: any) => {
    const client = new ftp.Client(2000);
    client.ftp.verbose = process.env.NODE_ENV === "development";

    // Reset FTP connection state
    context.store.commit("CONNECTED", false);
    context.store.commit("CONNECTING", false);
    context.store.commit("FTP_BUSY", false);

    const initConnection = () => {
        return new Promise(async (resolve) => {
            context.store.commit("CONNECTED", false);
            context.store.commit("CONNECTING", true);
            try {
                context.store.commit("FTP_BUSY", true);
                await client.access({
                    host: context.store.state.settings.switchIp,
                    port: context.store.state.settings.switchPort,
                    user: context.store.state.settings.switchUser,
                    password: context.store.state.settings.switchPassword,
                });
                context.store.commit("CONNECTED", true);
                context.store.commit("CONNECTING", false);
                resolve(null);
            } catch (e) {
                // console.error(e);
                // Try again
            } finally {
                context.store.commit("FTP_BUSY", false);
            }
        });
    };

    const $ftpController = {
        disconnect() {
            client.close();
            context.store.commit("CONNECTED", false);
            context.store.commit("CONNECTING", true);
        },
        connect() {
            return new Promise((resolve) => {
                const poll = () => {
                    if (context.store.state.connected && !context.store.state.connecting) {
                        resolve(null);
                    }
                };

                poll();
                setInterval(() => {
                    poll();
                }, 500);
            });
        },
        async reboot() {
            return new Promise(async (resolve) => {
                this.connect().then(() => {
                    client.send("REB").then(() => {
                        resolve(null);
                    }).catch(resolve);
                });
            });
        },
        install() {
            if (context.store.state.settings.rebootOnInstall) {
                this.reboot();
            }
        },
    };

    const ping = () => {
        if (!context.store.state.ftpBusy) {
            client.send("NOOP").catch(initConnection);
        }
    };

    ping();
    setInterval(() => {
        ping();
    }, 5000);

    inject("ftpController", $ftpController);
    context.$ftpController = $ftpController;
}
