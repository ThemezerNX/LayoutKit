<template>
    <vs-navbar shadow target-scroll="#padding-scroll-content" v-bind:padding-scroll="logScroll()" padding-scroll
               center-collapsed
               v-model="$parent.$data.active">
        <!--        <template #left>-->
        <!--            <vs-button @click="$parent.$data.activeSidebar = !$parent.$data.activeSidebar" flat icon>-->
        <!--                <i class='bx bx-menu'></i>-->
        <!--            </vs-button>-->
        <!--        </template>-->
        <template #left>
            <!--TODO: Decrease avatar size on scroll-->
            <vs-avatar size="40">
                <img alt="application logo" src="@/assets/icon-64.png">
            </vs-avatar>
        </template>
        <vs-navbar-item :active="$parent.$data.active === 'guide'" id="guide">
            Guide
        </vs-navbar-item>
        <vs-navbar-item :active="$parent.$data.active === 'docs'" id="docs">
            Documents
        </vs-navbar-item>
        <vs-navbar-item :active="$parent.$data.active === 'components'" id="components">
            Components
        </vs-navbar-item>
        <vs-navbar-item :active="$parent.$data.active === 'license'" id="license">
            license
        </vs-navbar-item>
        <template #right>
            <vs-row style="width: 80px; height: 32px">
                <div ref="buildLoader"/>
            </vs-row>
        </template>
    </vs-navbar>
</template>

<script>
export default {
    methods: {
        buildLoading() {
            this.$vs.loading({
                target: this.$refs.buildLoader,
                opacity: "0",
                type: "scale",
                scale: "1.0",
                text: "Packing SZS...", // TODO: remove text on scroll
            });
        },
        logScroll() {
            console.log("Scrolled!");
        },
    },
    mounted() {
        this.buildLoading();

    },
};
</script>

