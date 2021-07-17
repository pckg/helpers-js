import routerHelper from "./router.helper.js";

export default function resolved(name) {
    return {
        [name]() {
            if ($store.getters['page/resolved']) {
                return routerHelper.getResolvedObject(name, $store.getters['page/resolved'](name));
            }

            if (!this.$route.meta || !this.$route.meta.resolved) {
                return null;
            }

            let value = this.$route.meta.resolved[name];
            if (!value) {
                return null;
            }

            return routerHelper.getResolvedObject(name, value);
        },
    };
}
