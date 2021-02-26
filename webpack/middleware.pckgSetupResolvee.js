export function pckgSetupResolvee(param, url, of) {
    return {
        methods: {
            initialFetch: function () {
                $dispatcher.$emit('page:resolving');
                console.log('fetching route param', param, of);
                http.get('/api/' + url + '/' + this.$router.currentRoute.params[param], (data) => {
                    console.log('fetched route param ', param, data[param]);
                    this.$router.currentRoute.meta.resolved[param] = of ? new of(data[param]) : data[param];
                    this.loading = false;
                    $dispatcher.$emit('page:loaded');
                });
            }
        },
        created: function () {
            this.initialFetch();
        },
        computed: {
            [param]: function () {
                return this.$router.currentRoute.meta.resolved[param];
            }
        }
    };
}
