<template>
    <vse-list>
        <template v-for="item in items">
            <vse-list-item :key="item.name">
                <template #title>
                    item.name
                </template>
                <template #button>
                    <vs-button v-model="installOnChange"/>
                </template>
            </vse-list-item>
        </template>
    </vse-list>
</template>

<script>
export default {
    data: () => ({}),
    props: {
        path: {
            type: String,
            required: true,
        },
    },
    computed: {
        items() {
            if (this.path) {
                // read directory here
            }

            return [];
        },
    },
};
</script>
