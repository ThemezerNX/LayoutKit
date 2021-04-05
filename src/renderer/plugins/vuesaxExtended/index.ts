import Vue from "vue";
import Spacer from "./spacer.vue";
import Footer from "./footer.vue";
import Card from "./card.vue";
import List from "./list.vue";
import ListItem from "./listItem.vue";

const components = {
    Spacer,
    Footer,
    Card,
    List,
    ListItem,
};

Object.entries(components).forEach(([name, component]) => {
    // @ts-ignore
    Vue.component(`vse${name}`, component);
});