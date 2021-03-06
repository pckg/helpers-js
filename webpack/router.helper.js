import middlewareResolveStaticParams from "./middleware.resolveStaticParams";
import dispatchPageLoaded from "./middleware.dispatchPageLoaded";
import setSeoTags from "./middleware.setSeoTags";
import gaPageLoad from "./middleware.gaPageLoad";

export class RouterHelper {

    constructor(props) {
        this.paramMapper = {};
    }

    beforeEach(to, from, next) {
        console.log('before each', to, from);

        typeof $vue !== 'undefined' && $dispatcher.$emit('page:loading');

        if ((to?.meta?.resolves || []).length > 0) {
            typeof $vue !== 'undefined' && $dispatcher.$emit('page:resolving');
        }

        next();
    }

    beforeResolve(to, from, next) {
        console.log('before resolve', to, from);

        middlewareResolveStaticParams(to, from).then(() => {
            console.log('middleware resolve static params resolved');
            next();
        }).catch((e) => {
            $dispatcher.$emit('page:errored');
            console.log('middleware resolve static params rejected', e);
            next(false);
        });
    }

    afterEach(to, from) {
        dispatchPageLoaded();
        let title = setSeoTags(to);
        gaPageLoad(to, title);
    }

    mapParameters(params) {
        Object.keys(params).forEach((key) => {
            this.mapParameter(key, params[key]);
        })
    }

    mapParameter(param, obj) {
        this.paramMapper[param] = obj;
        return this;
    }

    getResolvedObject(name, value) {
        if (!this.paramMapper[name]) {
            // or null?
            return {
                id: value
            };
        }

        return new (this.paramMapper[name])(value)
    }

}

const routerHelper = new RouterHelper();

export default routerHelper;
