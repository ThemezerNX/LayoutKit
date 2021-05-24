// This file should contain all stuff related to rebooting and uploading.
import * as path from "path";
import * as ftp from "basic-ftp";
import {getFtpDestination} from "./managerUtils";
import log from "electron-log";
const ftpLog = log.scope("ftpController");

export default (context: any, inject: any) => {
    const client = new ftp.Client(2000);
    client.ftp.verbose = process.env.NODE_ENV === "development";

    const initConnection = () => {
        return new Promise(async (resolve) => {
            context.store.commit("CONNECTED", false);
            context.store.commit("CONNECTING", true);
            try {
                context.store.commit("FTP_BUSY", true);
                await client.access({
                    host: context.store.state.settings.ftpIp,
                    port: context.store.state.settings.ftpPort,
                    user: context.store.state.settings.ftpUsername,
                    password: context.store.state.settings.ftpPassword,
                });
                context.store.commit("CONNECTED", true);
                context.store.commit("CONNECTING", false);
                resolve(null);
            } catch (e) {
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
        async install(filePaths: string[]) {
            try {
                ftpLog.info("[ftpController]: pushing files", filePaths);
                for (const filePath of filePaths) {
                    const destinationPath = getFtpDestination(filePath);
                    const destinationDir = path.dirname(destinationPath);
                    context.store.commit("FTP_BUSY", true);
                    await client.ensureDir(destinationDir);
                    ftpLog.info("[ftpController]:", filePath, "to", destinationPath);
                    await client.uploadFrom(filePath, destinationPath);
                }
                if (context.store.state.settings.rebootOnInstall) {
                    await this.reboot();
                }
            } catch (e) {
                ftpLog.warn(e)
            } finally {
                ftpLog.info("[ftpController]: Finished pushing files");
                context.store.commit("FTP_BUSY", false);
            }
        },
    };

    // Reset FTP connection state
    context.store.commit("CONNECTED", false);
    context.store.commit("CONNECTING", false);
    context.store.commit("FTP_BUSY", false);

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
