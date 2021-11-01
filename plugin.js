export default {
    install(Vue, options) {
        Vue.component('pckg-modal-actionable', () => import('./modal/actionable.vue'));
        Vue.component('pckg-modal-delete', () => import('./modal/delete.vue'));
        Vue.component('btn-loader', () => import('./button/btn-loader.vue'));
        Vue.component('pckg-tooltip', () => import('./tooltip/tooltip.vue'));
        Vue.component('pckg-clipboard', () => import('./clipboard/clipboard.vue'));
    }
}
