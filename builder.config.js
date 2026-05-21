require("dotenv").config();
const ICONS_DIR = "build/icons/";

const windowsOS = {
    win: {
        icon: ICONS_DIR + "icon.ico",
        target: "portable",
    },
};

module.exports = {
    productName: "LayoutKit",
    appId: "net.themezer.layoutkit",
    artifactName: "portable-${version}.${ext}",
    directories: {
        output: "build",
    },
    publish: {
        provider: "github",
        token: process.env.GITHUB_ACCESS_TOKEN
    },
    files: [
        "package.json",
        {
            from: "dist/main/",
            to: "dist/main/",
        },
        {
            from: "dist/renderer",
            to: "dist/renderer/",
        },
    ],
    ...windowsOS,
};
