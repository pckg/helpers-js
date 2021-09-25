import FormGroup from './form-group.vue';
import PbRouteLayout from './route.vue';
//import LoaderIndicator from './loader-indicator.vue';
import PckgModal from './modal.vue';
import PckgHtmleditor from "./../vue/pckgHtmleditor.vue";
const LoaderIndicator = () => import("./loader-indicator.vue"); // this imports css
const PckgDispatcherNotifications = () => import("../alert/dispatcher-notifications.vue"); // this also

export default {
    install(Vue, options) {
        Vue.component('pb-route-layout', PbRouteLayout);
        Vue.component('loader-indicator', LoaderIndicator);

        Vue.component('pckg-modal', PckgModal);
        if (!options || !(options.disabled ?? []).includes('form-group')) {
            Vue.component('form-group', FormGroup);
        }
        Vue.component('pckg-htmleditor', PckgHtmleditor);
        Vue.component('pckg-dispatcher-notifications', PckgDispatcherNotifications);
        //Vue.component('htmlbuilder-validator-error', import("../../../../vendor/pckg/htmlbuilder/src/Pckg/Htmlbuilder/View/htmlbuilderValidatorError.vue"));
    }
};
