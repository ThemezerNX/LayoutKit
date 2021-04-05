import VuexPersistence from "vuex-persist";

export default ({store}) => {
    new VuexPersistence({storage: window.localStorage}).plugin(store);
}