<template>
    <vs-row>
        <vs-col class="pr-30" w="8">
            <project-browser ref="browser"/>
        </vs-col>
        <vs-col w="4">
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
    head() {
        const metaTitle = "Projects - LayoutKit";

        return {
            title: metaTitle,
            meta: [
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
};
</script>