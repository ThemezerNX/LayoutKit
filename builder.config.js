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
    extraResources: [
        {
            from: "src/extraResources/",
            to: "",
        },
    ],
    ...windowsOS,
};
