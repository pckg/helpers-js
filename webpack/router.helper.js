import middlewareResolveStaticParams from "./middleware.resolveStaticParams";
import dispatchPageLoaded from "./middleware.dispatchPageLoaded";
import setSeoTags from "./middleware.setSeoTags";
import gaPageLoad from "./middleware.gaPageLoad";

export class RouterHelper {

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
            console.log('middleware resolve static params rejected', e);
            next(false);
        });
    }

    afterEach(to, from) {
        dispatchPageLoaded();
        let title = setSeoTags(to);
        gaPageLoad(to, title);
    }

}

const routerHelper = new RouterHelper();

export default routerHelper;
