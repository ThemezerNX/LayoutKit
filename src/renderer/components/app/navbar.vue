<template>
    <vs-navbar shadow target-scroll="#padding-scroll-content" padding-scroll center-collapsed fixed
               v-model="$parent.$data.active">
        <template #left>
            <!--TODO: Decrease avatar size on scroll-->
            <nuxt-link to="/">
                <vs-avatar size="40">
                    <img alt="application logo" src="~/assets/icons/icon-64.png">
                </vs-avatar>
            </nuxt-link>
            <h1 class="my-0 ml-15">LayoutKit</h1>
        </template>

        <template v-for="menuItem in menuItems">
            <vs-navbar-item v-if="!menuItem.children" :key="menuItem.id" :to="menuItem.path"
                            :active="$nuxt.$route.path === menuItem.path"
                            :id="menuItem.id">
                {{ menuItem.title }}
                <i v-if="menuItem.icon" :class="menuItem.icon" class="navbar-item-icon"></i>
            </vs-navbar-item>
            <vs-navbar-group v-else :key="menuItem.id">
                {{ menuItem.title }}
                <i v-if="menuItem.icon" :class="menuItem.icon" class="navbar-item-icon"></i>
                <template #items>
                    <template v-for="child in menuItem.children">
                        <vs-navbar-item :key="child.id" :to="menuItem.path + child.path"
                                        :active="$nuxt.$route.path === menuItem.path + child.path"
                                        :id="child.id">
                            {{ child.title }}
                        </vs-navbar-item>
                    </template>
                </template>
            </vs-navbar-group>
        </template>

        <template #right>
            <vs-row style="width: 80px; height: 32px">
                <div ref="buildLoader"/>
            </vs-row>
        </template>
    </vs-navbar>
</template>

<script>
export default {
    data: () => ({
        menuItems: [
            {
                id: "projects",
                path: "/projects",
                title: "Projects",
                icon: "bx bxs-wrench",
            },
            {
                id: "documentation",
                path: "/documentation",
                title: "Documentation",
                icon: "bx bxs-book",
            },
            {
                id: "szs_manager",
                path: "/szs_manager",
                title: "SZS Manager",
                icon: "bx bx-library",
                children: [
                    {
                        id: "projects_szs",
                        path: "/projects",
                        title: "Projects",
                        icon: "",
                    },
                    {
                        id: "firmwares_szs",
                        path: "/firmwares",
                        title: "Firmwares",
                        icon: "",
                    },
                ],
            },
            {
                id: "settings",
                path: "/settings",
                title: "Settings",
                icon: "bx bxs-wrench",
            },
        ],
    }),
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
    },
    mounted() {
        this.$parent.$data.active = this.menuItems[0].path;
        this.buildLoading();
    },
};
</script>

<style lang="scss" scoped>
.navbar-item-icon {
    transform: translateY(1px);
}
</style>
