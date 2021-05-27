<template>
    <div>
        <app-navbar/>
        <app-sidebar/>
        <!--    Use this scroll detector component to pad the main page 84 pixels down (the height of the navbar)    -->
        <div id="padding-scroll-content" class="pa-20" style="padding-top: 104px !important;">
            <nuxt/>
        </div>
        <popup/>
        <auto-updater/>
        <update-checker/>
    </div>
</template>

<script>
import appNavbar from "~/components/app/navbar.vue";
import appSidebar from "~/components/app/sidebar.vue";
import updateChecker from "~/components/updateChecker.vue";

export default {
    components: {appNavbar, appSidebar, updateChecker},
    data: () => ({
        activeSidebar: false,
    }),
    beforeCreate() {
        this.$vs.setTheme("dark");
    },
    mounted() {
        if (localStorage.vsTheme === "dark") {
            this.$vs.setTheme("dark");
        }

        this.$ipcService.system.os().then(console.log);
    },
};
</script>

<style lang="scss">
@import 'assets/colors.scss';

* {
    font-family: "Arial", serif;
}

a {
    color: rgba(var(--vs-primary), 1);
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

// Select fix expanding on no entries
.vs-select--disabled > i {
    pointer-events: none !important;
}

// Make select messages a bit higher
.vs-select__message {
    height: 13px !important;
    margin-top: 2px;
}

// Fix missing tooltip style
.vs-tooltip {
    background: rgba(var(--vs-gray-3), 1) !important;
    color: var(--vs-text) !important;
    position: absolute !important;
    z-index: 1000000 !important;
    text-align: center !important;
    padding: 10px !important;
    border-radius: 12px !important;
    font-size: .85rem !important;
    max-width: 350px !important;
    min-width: 30px !important;
    min-height: 30px !important;
}

// Spinner animation for the refresh buttons
.spin {
    animation: rotate;
    animation-duration: 500ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
    100% {
        transform: rotate(180deg);
    }
}

// Use pointer for file select input
.file-select input {
    cursor: pointer;
}

// Fix for nested tables
.vs-table__td {
    padding: 10px 12px !important;
}

// Fix expanded tables not having border radius
.vs-table__expand__td {
    border-radius: 0 0 15px 15px;
}

// Fix for table body not growing when content changed
//.vs-table__tr__expand td .vs-table__expand__td__content {
//    height: auto !important;
//}

// Actions col in tables should flex
.actions {
    display: flex;
    float: right;
}
</style>
