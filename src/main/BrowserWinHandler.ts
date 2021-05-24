/* eslint-disable */
import {EventEmitter} from "events";
import {app, BrowserWindow} from "electron";
import * as windowStateKeeper from "electron-window-state";
import {autoUpdater} from "electron-updater";

const DEV_SERVER_URL = process.env.DEV_SERVER_URL;
const isProduction = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

export default class BrowserWinHandler {
    _eventEmitter: EventEmitter;
    allowRecreate: boolean;
    options: any;
    browserWindow: BrowserWindow;

    /**
     * @param options - browser window options
     * @param allowRecreate
     */
    constructor(options: object, allowRecreate: boolean = true) {
        this._eventEmitter = new EventEmitter();
        this.allowRecreate = allowRecreate;
        this.options = options;
        this.browserWindow = null;
        this._createInstance();
    }


    _createInstance() {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on("ready", () => {
            this._create();
        });

        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (!this.allowRecreate) return;
        app.on("activate", () => this._recreate());
    }

    _create() {
        // Load the previous state with fallback to defaults
        const mainWindowState = windowStateKeeper({
            defaultWidth: this.options.width,
            defaultHeight: this.options.height,
        });

        this.browserWindow = new BrowserWindow(
            {
                ...this.options,
                height: mainWindowState.height,
                width: mainWindowState.width,
                webPreferences: {
                    ...this.options.webPreferences,
                    webSecurity: isProduction, // disable on dev to allow loading local resources
                    nodeIntegration: true, // allow loading modules via the require () function
                    contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
                },
            },
        );

        // Let us register listeners on the window, so we can update the state
        // automatically (the listeners will be removed when the window is closed)
        // and restore the maximized or full screen state
        mainWindowState.manage(this.browserWindow);

        // Auto-updater
        if (isProduction) {
            this.browserWindow.once("ready-to-show", () => {
                setTimeout(() => {
                    autoUpdater.checkForUpdatesAndNotify().then();
                }, 1000);
            });
            autoUpdater.on("update-available", () => {
                this.browserWindow.webContents.send("updateAvailable");
            });
            autoUpdater.on("update-downloaded", () => {
                this.browserWindow.webContents.send("updateDownloaded");
            });
        }

        this.browserWindow.on("closed", () => {
            // Dereference the window object
            this.browserWindow = null;
        });

        // Fix for the window not closing with devtools open and autoHideMenuBar: true
        this.browserWindow.on("close", () => {
            if (this.browserWindow.webContents.isDevToolsOpened()) {
                this.browserWindow.webContents.closeDevTools();
            }
        });

        this._eventEmitter.emit("created");
    }

    _recreate() {
        if (this.browserWindow === null) this._create();
    }

    /**
     * @callback onReadyCallback
     * @param {BrowserWindow}
     */

    /**
     *
     * @param callback {onReadyCallback}
     */
    onCreated(callback: { (browserWindow: BrowserWindow): void; }) {
        if (this.browserWindow !== null) return callback(this.browserWindow);
        this._eventEmitter.once("created", () => {
            callback(this.browserWindow);
            this.browserWindow.webContents.once("dom-ready", () => {
                if (isDev && BrowserWindow.getAllWindows().length === 1) this.browserWindow.webContents.openDevTools();
            });
        });
    }

    async loadPage(pagePath: string) {
        if (!this.browserWindow) return Promise.reject(new Error("The page could not be loaded before win 'created' event"));
        const serverUrl = isDev ? DEV_SERVER_URL : "app://./index.html";
        const fullPath = serverUrl + "#" + pagePath;
        await this.browserWindow.loadURL(fullPath);
    }

    /**
     *
     * @returns {Promise<BrowserWindow>}
     */
    created() {
        return new Promise(resolve => {
            this.onCreated(() => resolve(this.browserWindow));
        });
    }
}
