require("dotenv").config();
const ICONS_DIR = "build/icons/";

const windowsOS = {
    win: {
        icon: ICONS_DIR + "icon.ico",
        publisherName: "ThemezerNX",
        target: "nsis",
    },

    nsis: {
        differentialPackage: true,
        perMachine: true,
        oneClick: false,
    },
};

module.exports = {
    productName: "LayoutKit",
    appId: "net.themezer.layoutkit",
    artifactName: "setup-${version}.${ext}",
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
