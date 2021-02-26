export default async function (to, from) {
    return new Promise((resolve, reject) => {
        if (Object.keys(to.params).length === 0) {
            console.log('No params to resolve');
            return resolve();
        }

        if (!from.name) {
            console.log('Should be pre-resolved');
            return resolve();
        }

        $dispatcher.$emit('page:resolving');
        let tags = to.meta.tags;
        let routeId = typeof tags === 'object' ? tags['generic:id'] : null;
        console.log('getting route', routeId);
        let add = to.path.indexOf('?') > 0 ? '&html=1' : '?html=1';

        if (false && JSON.stringify(to.params) === JSON.stringify(from.params) && to.meta.tags['vue:route:template']) {
            //to.meta.tags['vue:route:template'] = from.meta.tags['vue:route:template']; // yeah?
            console.log('same route params?');
            return resolve();
        }

        /**
         * First option, should be supported by default?
         */
        http.get(to.path + add, function (data) {
            console.log('got ajax response');
            $store.commit('setActions', []);
            $store.commit('mergeMetaData', data.metadata || {});
            to.meta.tags['vue:route:template'] = data.html;
            to.meta.resolved = data.resolved || {};
            resolve();
        }, function () {
            console.log('error ajax response');
            reject();
            $dispatcher.$emit('notification:error', 'Error navigating');
        });

        /**
         * Second option.
         */
        return;
        http.get('/api/' + url + '/' + this.$router.currentRoute.params[param], (data) => {
            console.log('fetched route param ', param, data[param]);
            this.$router.currentRoute.meta.resolved[param] = of ? new of(data[param]) : data[param];
            this.loading = false;
            $dispatcher.$emit('page:loaded');
        });
    });
}
