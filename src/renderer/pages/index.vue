<template>
    <!-- General introduction here on a card. Loaded route should be saved to vuex and loaded again on boot. -->
</template>

<script>
import {remote} from "electron";

export default {
    data: () => ({}),
    methods: {
        openURL(url) {
            remote.shell.openExternal(url);
        },
    },
};
</script>