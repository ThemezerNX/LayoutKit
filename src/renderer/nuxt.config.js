/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
    ssr: false,
    target: "static",
    head: {
        title: "LayoutKit",
        meta: [{charset: "utf-8"}],
    },
    loading: false,
    plugins: [
        {src: "@/plugins/icons", ssr: true},
        {src: "@/plugins/vuesax", ssr: true},
        {src: "@/plugins/vuesaxExtended", ssr: true},
        {src: "@/plugins/vuexPersist", ssr: false},
        {src: "@/plugins/popup", ssr: false},
        {src: "@/plugins/ipcService", ssr: false},
        {src: "@/plugins/ftpController", ssr: false},
        {src: "@/plugins/managers/projectManager", ssr: false},
        {src: "@/plugins/managers/firmwareManager", ssr: false},
        {src: "@/plugins/managers/toolManager", ssr: false},
    ],
    buildModules: ["@nuxt/typescript-build"],
    modules: [],
};
