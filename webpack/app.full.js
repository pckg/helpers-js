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

    use(usage) {
        Vue.use(usage);

        return this;
    }

    register(data) {
        if (typeof data === 'function') {
            data = data({Vue, Vuex, VueRouter, routerHelper});
        }

        const store = window.$store = new Vuex.Store(this.$store);

        window.$vue = new Vue(Object.assign(data, {
            el: '#vue-app',
            router,
            store,
        }));

        return this;
    }

}
