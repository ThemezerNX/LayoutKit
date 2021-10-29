/* eslint-disable */
import {app, Menu, MenuItem} from "electron";
// @ts-ignore
import installExtension, {VUEJS_DEVTOOLS} from "electron-devtools-installer";
import {ELECTRON_RELAUNCH_CODE} from "../../../.electron-nuxt/config";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.on("ready", () => {
    const menu = Menu.getApplicationMenu();
    const refreshButton = new MenuItem({
        label: "Relaunch electron",
        accelerator: "CommandOrControl+E",
        click: () => {
            app.exit(ELECTRON_RELAUNCH_CODE);
        },
    });
    menu.append(refreshButton);
    Menu.setApplicationMenu(menu);

    installExtension(VUEJS_DEVTOOLS);
});

if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
}

const handleProcessExit = () => {
    app.exit(0);
    process.exit(0);
};

process.on("SIGINT", handleProcessExit);
process.on("SIGQUIT", handleProcessExit);
process.on("SIGTERM", handleProcessExit);

// Require `main` process to boot app
// @ts-ignore
import ("../index.ts");
