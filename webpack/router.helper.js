import middlewareResolveStaticParams from "./middleware.resolveStaticParams";
import dispatchPageLoaded from "./middleware.dispatchPageLoaded";
import setSeoTags from "./middleware.setSeoTags";
import gaPageLoad from "./middleware.gaPageLoad";
import {Campaign, List} from "../../../../app/mailo/public/js/orm";

export class RouterHelper {

    constructor(props) {
        this.paramMapper = {};
    }

    beforeEach(to, from, next) {
        console.log('before each', to, from);
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
        console.log($vue.routeUniqueId);
    }

    mapParameter(param, obj) {
        this.paramMapper[param] = obj;
        return this;
    }

    getResolvedObject(name, value) {
        return new (this.paramMapper[name])(value)
    }

}

const routerHelper = new RouterHelper();

export default routerHelper;
