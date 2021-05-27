require("dotenv").config();
const ICONS_DIR = "build/icons/";

const windowsOS = {
    win: {
        icon: ICONS_DIR + "icon.ico",
        // publisherName: "OU=LayoutKit, O=ThemezerNX, S=Internet, C=NL",
        // publisher: "ThemezerNX",
        // certificateFile: "ThemezerNX.pfx",
        target: "nsis",
    },

    nsis: {
        differentialPackage: false,
        perMachine: true,
        oneClick: false,
        allowToChangeInstallationDirectory: true,
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
