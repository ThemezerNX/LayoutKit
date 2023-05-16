<template>
    <!-- General introduction here on a card. Loaded route should be saved to vuex and loaded again on boot. -->
    <vs-row style="padding-bottom: 84px">
        <vs-col w="12">
            <vse-card height="100%" max-width="750px" shadow>
                <template #content>
                    <div class="content">
                        <img alt="application logo" class="image user-select-none" src="~/assets/icons/icon-256.png">
                        <h1 class="title text-shadow user-select-none">Welcome to LayoutKit!</h1>
                        <span class="slogan text-shadow user-select-none">
                            LayoutKit is a tool that makes it easier to create Nintendo Switch layouts<br>
                        </span>
                        <h2 class="title-2 text-shadow user-select-none getting-started">
                            <a href="https://themezernx.github.io/LayoutDocs/guide/#getting-started"
                               style="text-decoration: none;"
                               target="_blank">
                                Getting Started <i class='bx bx-link-external'></i>
                            </a>
                        </h2>
                        <h2 class="title-2 text-shadow user-select-none">Features</h2>
                        <div class="content-2">
                            <ul>
                                <li>Easy project environment management</li>
                                <li>Easily and visually edit files in
                                    <a href="#"
                                       @click.prevent="$ipcService.system.openUrl('https://github.com/KillzXGaming/Switch-Toolbox')">
                                        Switch-Toolbox
                                    </a>
                                    or
                                    <a href="#"
                                       @click.prevent="$ipcService.system.openUrl('https://github.com/FuryBaguette/SwitchLayoutEditor')">
                                        SwitchLayoutEditor
                                    </a>
                                </li>
                                <li>Import and export layout json files using
                                    <a href="#"
                                       @click.prevent="$ipcService.system.openUrl('https://github.com/exelix11/SwitchThemeInjector')">
                                        Switch Theme Injector
                                    </a>
                                </li>
                                <li>Wirelessly transfer menu files to the Switch over FTP</li>
                                <li>Automatically push files after changes were made</li>
                                <li>Reboot the Switch via the desktop application</li>
                            </ul>
                        </div>
                        <h2 class="title-2 text-shadow user-select-none">How To Use</h2>
                        <div class="content-2">
                            <ul>
                                <li>The 'Projects' tab shows all your working environments</li>
                                <li>The 'Firmwares' tab shows all the firmwares you have imported and can work with</li>
                                <li>The 'Documentation' tab has many instructions and examples that can help you make
                                    your layout, or where to
                                    find
                                    specific components of the Switch's menus
                                </li>
                                <li>The 'Settings' tab lets you configure your preferences and Switch's FTP details</li>
                            </ul>
                        </div>
                    </div>
                </template>
            </vse-card>
        </vs-col>
        <vse-footer class="px-10" fixed shadow style="height: 84px">
            <p class="center">
                v{{ applicationVersion }} - Made with {{ randomEmoji }} by
                <a href="#" @click.prevent="$ipcService.system.openUrl('https://github.com/ThemezerNX')">
                    ThemezerNX</a>
            </p>
            <p class="center">
                Source code available on
                <a href="#" @click.prevent="$ipcService.system.openUrl('https://github.com/ThemezerNX/LayoutKit')">
                    GitHub</a>
                - For support join the
                <a href="#" @click.prevent="$ipcService.system.openUrl('https://discord.gg/nnm8wyM')">
                    Discord server
                </a>
            </p>
        </vse-footer>
    </vs-row>
</template>

<script>
const positiveEmojis = ["❤️", "✨", "🔥", "👍", "💪", "🤪", "🎉", "🦠", "🤠", "🚀"];

export default {
    data: () => ({
        applicationVersion: null,
    }),
    mounted() {
        this.$ipcService.system.version().then((s) => this.applicationVersion = s);
    },
    computed: {
        randomEmoji() {
            return positiveEmojis[Math.floor(Math.random() * positiveEmojis.length)];
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 20px;

    .text-shadow {
        text-shadow: 0 2px 10px #00000080;
    }

    .user-select-none {
        user-select: none;
    }

    .image {
        width: 128px;
        margin: auto;
        border-radius: 35%;
        min-height: 128px;
        box-shadow: 0 8px 18px 5px rgba(0, 0, 0, .3);
    }

    .title {
        padding-bottom: 12px;
        padding-top: 16px;
    }

    .slogan {
        margin-bottom: 16px;
    }

    .getting-started {
        padding-bottom: 8px
    }

    .title-2 {
        padding-top: 16px;
    }

    .content-2 {
        opacity: 0.8;
    }
}

.center {
    text-align: center;
}
</style>
