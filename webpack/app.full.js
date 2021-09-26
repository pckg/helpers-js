import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VeeValidate from "vee-validate/dist/vee-validate.min";
import PckgHelpersJs from "./setup.vue.js";
import router from './router.full.js';
import routerHelper from './router.helper.js';

export class PckgApp {

    constructor() {
        Vue.use(Vuex);
        Vue.use(VueRouter);
        Vue.use(VeeValidate);
        Vue.use(PckgHelpersJs);

        window.Vue = Vue;
        window.$dispatcher = new Vue();
        this.$store = {};
        this.$router = null;
        this.myStore = null;
        this.myRouter = null;
    }

    dev() {
        Vue.config.debug = true;
        Vue.config.silent = false;
        Vue.config.devtools = true;
        Vue.config.performance = true;

        return this;
    }

    prod() {
        Vue.config.debug = false;
        Vue.config.silent = true;
        Vue.config.devtools = false;
        Vue.config.performance = false;

        return this;
    }

    store(store = {}) {
        this.$store = store;

        return this;
    }

    router(router = {}) {
        this.$router = router;

        return this;
    }

    use(usage) {
        Vue.use(usage);

        return this;
    }

    register(data = {}) {
        const myStore = window.$store = this.myStore = this.$store instanceof Vuex.Store
            ? this.$store
            : new Vuex.Store(this.$store);

        const myRouter = this.myRouter = this.$router instanceof VueRouter
            ? this.$router
            : router;

        if (data instanceof Function) {
            data = data({Vue, Vuex, VueRouter, routerHelper}) || {};
        }

        window.$vue = new Vue(Object.assign(data, {
            el: '#vue-app',
            router: myRouter,
            store: myStore,
        }));

        return this;
    }

}
