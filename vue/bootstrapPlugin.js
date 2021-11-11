const PckgTooltipComponent = () => import ("../tooltip/tooltip.vue");
const PckgClipboardComponent = () => import ("../clipboard/clipboard.vue");
const PckgHtmlbuilderDropzoneComponent = () => import ("./pckg-htmlbuilder-dropzone.vue");
const PckgSelectComponent = () => import ("./pckgSelect.vue");
const PckgHtmleditorComponent = () => import ("./pckgHtmleditor.vue");
const DInputNumpadComponent = () => import ("./_input_numpad.vue");
const DInputRadioComponent = () => import ("./_input_radio.vue");
const DInputButtonComponent = () => import ("./_input_button.vue");
const DInputMultiComponent = () => import ("./_input_multi.vue");
const DInputToggleComponent = () => import ("./_input_toggle.vue");
const DInputCheckboxComponent = () => import ("./_input_checkbox.vue");
const DInputColorComponent = () => import ("./_input_color.vue");
const DSelectPillsComponent = () => import ("./_select_pills.vue");

export default {
    install(Vue) {
        Vue.component('pckg-tooltip', PckgTooltipComponent);
        Vue.component('pckg-clipboard', PckgClipboardComponent);
        Vue.component('pckg-select', PckgSelectComponent);
        Vue.component('pckg-htmleditor', PckgHtmleditorComponent);
        Vue.component('pckg-htmlbuilder-dropzone', PckgHtmlbuilderDropzoneComponent);
        Vue.component('d-input-radio', DInputRadioComponent);
        Vue.component('d-input-checkbox', DInputCheckboxComponent);
        Vue.component('d-input-color', DInputColorComponent);
        Vue.component('d-input-button', DInputButtonComponent);
        Vue.component('d-input-multi', DInputMultiComponent);
        Vue.component('d-input-toggle', DInputToggleComponent);
        Vue.component('d-select-pills', DSelectPillsComponent);
        Vue.component('d-input-numpad', DInputNumpadComponent);
    }
}
