import FormGroup from './form-group.vue';
import PbRouteLayout from './route.vue';
//import LoaderIndicator from './loader-indicator.vue';
import PckgModal from './modal.vue';
import PckgHtmleditor from "./../vue/pckgHtmleditor.vue";
const LoaderIndicator = () => import("./loader-indicator.vue"); // this imports css

export default {
    install(Vue) {
        Vue.component('pb-route-layout', PbRouteLayout);
        Vue.component('loader-indicator', LoaderIndicator);

        Vue.component('pckg-modal', PckgModal);
        Vue.component('form-group', FormGroup);
        Vue.component('pckg-htmleditor', PckgHtmleditor);
        //Vue.component('htmlbuilder-validator-error', import("../../../../vendor/pckg/htmlbuilder/src/Pckg/Htmlbuilder/View/htmlbuilderValidatorError.vue"));
    }
};
