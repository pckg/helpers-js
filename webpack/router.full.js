import VueRouter from "vue-router";
import routerHelper from "./router.helper.js";

const router = new VueRouter({
    mode: 'history',
    routes: Pckg.router.vueUrls || []
});

router.beforeEach(function (to, from, next) {
    /**
     * Validate access.
     */
    routerHelper.beforeEach(to, from, next);
});

router.beforeResolve(function (to, from, next) {
    /**
     * Resolve route params.
     */
    routerHelper.beforeResolve(to, from, next);
});

router.afterEach(function (to, from) {
    /**
     * Dispatch to $vue.
     * Apply SEO meta tags from meta.tags['seo:title']
     * Send event to GA.
     */
    routerHelper.afterEach(to, from);
});

export default router;
