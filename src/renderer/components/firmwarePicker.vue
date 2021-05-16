<template>
    <vs-table
        v-model="selected"
        :disabled="firmwareFiles.length === 0"
        :loading="loading"
    >
        <template #thead>
            <vs-tr>
                <vs-th class="checkbox-column">
                    <vs-checkbox
                        v-model="allChecked"
                        :checked-force="selected.length > 0 && selected.length === firmwareFiles.length"
                        :indeterminate="selected.length > 0 && selected.length < firmwareFiles.length"
                        class="checkbox"
                        @change="selected = $vs.checkAll(selected, firmwareFiles)"
                    />
                </vs-th>
                <vs-th>
                    Menu
                </vs-th>
                <vs-th>
                    Filename
                </vs-th>
            </vs-tr>
        </template>
        <template #tbody>
            <template v-for="file in firmwareFiles">
                <vs-tr
                    :key="file"
                    :data="file"
                    :is-selected="!!selected.includes(file)"
                >
                    <vs-td checkbox class="checkbox-column">
                        <vs-checkbox v-model="selected" :val="file"
                                     class="checkbox"/>
                    </vs-td>
                    <vs-td>
                        {{ toNice(file) }}
                    </vs-td>
                    <vs-td>
                        {{ file }}
                    </vs-td>
                </vs-tr>
            </template>
        </template>
    </vs-table>
</template>

<script>

import {toNice} from "@themezernx/target-parser/dist";

export default {
    data: () => ({
        allChecked: false,
    }),
    props: {
        value: {
            type: Array,
            required: true,
        },
        firmwareFiles: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        selected: {
            get() {
                return this.value;
            },
            set(set) {
                this.$emit("input", set);
            },
        },
    },
    methods: {
        toNice(filename) {
            return toNice(filename);
        },
    },
};

</script>

<style lang="scss" scoped>
.checkbox-column {
    width: 50px !important;
}

.checkbox {
    width: fit-content;
    margin: auto;
}
</style>