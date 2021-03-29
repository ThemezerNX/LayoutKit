<template>
    <div vs-theme="dark">
        <app-navbar/>
        <app-sidebar/>
        <div id="padding-scroll-content"></div>
        <nuxt/>
    </div>
</template>

<script>
import appNavbar from "@/components/navbar";
import appSidebar from "@/components/sidebar";

export default {
    components: {appNavbar, appSidebar},
    data: () => ({
        active: "guide",
        activeSidebar: false,
    }),
};
</script>

<style>
* {
    font-family: "Arial", serif;
}

html, body {
    margin: 0 !important;
}

//TODO: Custom scroll bar
</style>

<style lang="scss">
// Spacing helper classes
$spaceamounts: (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100);
$sides: (top, bottom, left, right);

@each $space in $spaceamounts {
    @each $side in $sides {
        .m#{str-slice($side, 0, 1)}-#{$space} {
            margin-#{$side}: #{$space}px !important;
        }

        .p#{str-slice($side, 0, 1)}-#{$space} {
            padding-#{$side}: #{$space}px !important;
        }
    }
}

// Loader text width
.vs-loading__load__text {
    width: max-content !important;
}
</style>
