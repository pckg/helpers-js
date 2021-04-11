import middlewareResolveStaticParams from "./middleware.resolveStaticParams";
import dispatchPageLoaded from "./middleware.dispatchPageLoaded";
import setSeoTags from "./middleware.setSeoTags";
import gaPageLoad from "./middleware.gaPageLoad";

export class RouterHelper {

    constructor(props) {
        this.paramMapper = {};
    }

    beforeEach(to, from, next) {
        typeof $vue !== 'undefined' && $dispatcher.$emit('page:loading');

        if ((to?.meta?.resolves || []).length > 0) {
            typeof $vue !== 'undefined' && $dispatcher.$emit('page:resolving');
        }

        next();
    }

    beforeResolve(to, from, next) {
        middlewareResolveStaticParams(to, from).then(() => {
            next();
        }).catch((e) => {
            $dispatcher.$emit('page:errored');
            next(false);
        });
    }

    afterEach(to, from) {
        try { document.body.scrollIntoView({behavior: 'smooth'}); } catch (e) {}
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
