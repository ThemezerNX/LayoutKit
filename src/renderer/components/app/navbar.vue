<template>
    <vs-navbar v-model="$parent.$data.active" center-collapsed fixed padding-scroll shadow
               target-scroll="#padding-scroll-content">
        <template #left>
            <nuxt-link class="navbar-index-href" to="/">
                <vs-avatar size="40">
                    <img alt="application logo" src="~/assets/icons/icon-64.png">
                </vs-avatar>
                <h1 class="navbar-title my-0 ml-15">LayoutKit</h1>
            </nuxt-link>
        </template>

        <template v-for="menuItem in menuItems">
            <vs-navbar-group v-if="!!menuItem.children" :key="menuItem.id">
                {{ menuItem.title }}
                <i v-if="menuItem.icon" :class="menuItem.icon" class="navbar-item-icon"></i>
                <template #items>
                    <template v-for="child in menuItem.children">
                        <vs-navbar-item :id="child.id" :key="child.id"
                                        :active="$nuxt.$route.path === menuItem.path + child.path"
                                        :to="menuItem.path + child.path">
                            {{ child.title }}
                        </vs-navbar-item>
                    </template>
                </template>
            </vs-navbar-group>
            <vs-navbar-item v-else-if="!!menuItem.href" :id="menuItem.id" :key="menuItem.id"
                            :href="menuItem.href">
                {{ menuItem.title }}
                <i v-if="menuItem.icon" :class="menuItem.icon" class="navbar-item-icon"></i>
            </vs-navbar-item>
            <vs-navbar-item v-else :id="menuItem.id" :key="menuItem.id"
                            :active="$nuxt.$route.path === menuItem.path"
                            :to="menuItem.path">
                {{ menuItem.title }}
                <i v-if="menuItem.icon" :class="menuItem.icon" class="navbar-item-icon"></i>
            </vs-navbar-item>
        </template>

        <template #right>
            <vs-tooltip :not-arrow="false" arrow bottom>
                <vs-avatar :danger="!connected" :loading="connecting" :success="connected" class="ml-10" size="40">
                    <i class='bx bx-transfer'></i>
                </vs-avatar>
                <template #tooltip>
                    {{
                        connecting
                            ? "Trying to connect..."
                            : (connected ? "Connected to Switch" : "No Connection With Switch")
                    }}
                </template>
            </vs-tooltip>
        </template>
    </vs-navbar>
</template>

<script>
export default {
    data: () => ({
        loader: null,
        menuItems: [
            {
                id: "projects",
                path: "/projects",
                title: "Projects",
                icon: "bx bxs-wrench",
            },
            {
                id: "firmwares",
                path: "/firmwares",
                title: "Firmwares",
                icon: "bx bx-library",
            },
            {
                id: "documentation",
                href: "https://themezernx.github.io/LayoutDocs/",
                title: "Documentation",
                icon: "bx bxs-book",
            },
            {
                id: "settings",
                path: "/settings",
                title: "Settings",
                icon: "bx bxs-wrench",
            },
            {
                id: "info",
                path: "/",
                title: "Info",
                icon: "bx bxs-info-circle",
            },
        ],
    }),
    computed: {
        connected() {
            return this.$store.state.connected;
        },
        connecting() {
            return this.$store.state.connecting;
        },
    },
    mounted() {
        this.$parent.$data.active = this.menuItems[0].path;
    },
};
</script>

<style lang="scss" scoped>
.navbar-item-icon {
    transform: translateY(1px);
}

.navbar-index-href {
    display: inline-flex;
    color: inherit;
    text-decoration: none;
}

.navbar-title {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
