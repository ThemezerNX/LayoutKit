<template>

</template>

<script>
import {remote} from "electron";

export default {
    data: () => ({
        active: "guide",
    }),
    methods: {
        openURL(url) {
            remote.shell.openExternal(url);
        },
    },
};
</script>