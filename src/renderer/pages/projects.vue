<template>
    <vs-row>
        <vs-col class="pr-30" w="9">
            <project-browser ref="browser"/>
        </vs-col>
        <vs-col w="3">
            <vs-row>
                <quick-settings/>
            </vs-row>
            <vs-row>
                <project-details v-if="$store.state.activeProject.id.length > 0" class="mt-20"/>
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