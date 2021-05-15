// @ts-ignore
import BrowserWinHandler from "./BrowserWinHandler.ts";

const winHandler = new BrowserWinHandler({
    height: 600,
    width: 1000,
    minWidth: 800,
    frame: true,
    autoHideMenuBar: true
});

winHandler.onCreated(() => {
    winHandler.loadPage("/").then();
    // Or load custom url
    // browserWindow.loadURL('https://google.com')
});

export default winHandler;
