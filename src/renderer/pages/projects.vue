<template xmlns="">
    <vs-row>
        <vs-col w="9" class="pr-30">
            <project-browser/>
        </vs-col>
        <vs-col w="3">
            <vs-row>
                <quick-settings/>
            </vs-row>
            <vs-row>
                <project-details class="mt-20" v-if="!!$store.state.lastSelectedProject"/>
            </vs-row>
        </vs-col>
    </vs-row>
</template>

<script>
import projectBrowser from "~/components/projectBrowser.vue";
import quickSettings from "~/components/quickSettings.vue";
import projectDetails from "~/components/projectDetails.vue";

export default {
    components: {projectBrowser, quickSettings, projectDetails},
    data: () => ({}),
};
</script>