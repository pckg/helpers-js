import routerHelper from "./router.helper.js";

const resolveVuex = (resolve, params) => {
    $store.dispatch('page/setResolvedParams', params);
    resolve();
}

export default async function (to, from) {
    return new Promise((resolve, reject) => {
        /**
         * Check for generic route id?
         */
        if (typeof $vue === 'undefined') {
            // initial route
            return resolveVuex(resolve, to.meta.resolved); // yes?
        }

        if (Object.keys(to.params).length === 0) {
            // no params to resolve
            return resolveVuex(resolve, {});
        }

        if (!from.name) {
            // should be pre-resolved
            return resolveVuex(resolve, {});
        }

        $dispatcher.$emit('page:resolving');
        let tags = to.meta.tags;
        let routeId = typeof tags === 'object' ? tags['generic:id'] : null;

        if (false && JSON.stringify(to.params) === JSON.stringify(from.params) && to.meta.tags['vue:route:template']) {
            //to.meta.tags['vue:route:template'] = from.meta.tags['vue:route:template']; // yeah?
            // same route params?
            return resolve();
        }

        if (tags && tags['resolve:manual']) {
            // manually resolved
            return resolveVuex(resolve, {});
        }

        /**
         * First option, should be supported by default?
         */
        http.get(to.path, function (data) {
            $store.commit('setActions', []);
            $store.commit('mergeMetaData', data.metadata || {});
            to.meta.tags['vue:route:template'] = data.html;
            to.meta.resolved = data.resolved || {};
            resolveVuex(resolve, to.meta.resolved);
        }, function (response) {
            reject();
            $dispatcher.$emit('notification:error', 'Error navigating');
        }, {
            beforeSend(request) {
                request.setRequestHeader("X-Pckg-XHR", '1');
            }
        });

        /**
         * Second option.
         */
        return;
        http.get('/api/' + url + '/' + this.$router.currentRoute.params[param], (data) => {
            this.$router.currentRoute.meta.resolved[param] = of ? new of(data[param]) : data[param];
            this.loading = false;
            $dispatcher.$emit('page:loaded');
        });
    });
}
