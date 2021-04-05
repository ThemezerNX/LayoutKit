<template>
    <div>
        <app-navbar/>
        <app-sidebar/>
        <!--    Use this scroll detector component to pad the main page 84 pixels down (the height of the navbar)    -->
        <div id="padding-scroll-content" class="pa-20" style="padding-top: 104px !important;">
            <nuxt/>
        </div>
        <popup/>
    </div>
</template>

<script>
import appNavbar from "~/components/app/navbar.vue";
import appSidebar from "~/components/app/sidebar.vue";

export default {
    components: {appNavbar, appSidebar},
    data: () => ({
        activeSidebar: false,
    }),
    beforeCreate() {
        this.$vs.setTheme("dark");
    },
    mounted() {
        if (localStorage.vsTheme !== "dark") {
            this.$vs.setTheme("light");
        }

        this.$ipcService.system.version().then(console.log);
    },
};
</script>

<style lang="scss">
@import 'assets/colors.scss';

* {
    font-family: "Arial", serif;
}

html, body {
    margin: 0 !important;
}

html {
}

body {
    background-color: black;
    background: var(--theme-bg);
    color: rgba(var(--vs-text), 1);
}
</style>

<style lang="scss">
// Spacing helper classes
$spaceamounts: (-5, -10, -15, -20, -25, -30, -35, -40, -45, -50, -75, -100, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100);
$sides: (top, bottom, left, right);

@each $space in $spaceamounts {
    @each $side in $sides {
        @if $space < 0 {
            .m#{str-slice($side, 0, 1)}-n#{$space * -1} {
                margin-#{$side}: #{$space}px !important;
            }
        } @else {
            .m#{str-slice($side, 0, 1)}-#{$space} {
                margin-#{$side}: #{$space}px !important;
            }

            .p#{str-slice($side, 0, 1)}-#{$space} {
                padding-#{$side}: #{$space}px !important;
            }
        }
    }

    .mx-#{$space} {
        margin-left: #{$space}px !important;
        margin-right: #{$space}px !important;
    }

    .my-#{$space} {
        margin-top: #{$space}px !important;
        margin-bottom: #{$space}px !important;
    }

    .ma-#{$space} {
        margin: #{$space}px !important;
    }

    .px-#{$space} {
        padding-left: #{$space}px !important;
        padding-right: #{$space}px !important;
    }

    .py-#{$space} {
        padding-top: #{$space}px !important;
        padding-bottom: #{$space}px !important;
    }

    .pa-#{$space} {
        padding: #{$space}px !important;
    }
}

// Loader text width
.vs-loading__load__text {
    width: max-content;
}
</style>
