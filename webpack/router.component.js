import {Campaign, List} from "../../../../app/mailo/public/js/orm";
import routerHelper from "./router.helper.js";

export default function resolved(name) {
    return {
        [name]() {
            let value = this.$route.meta.resolved[name];
            if (!value) {
                return null;
            }

            return routerHelper.getResolvedObject(name, value);
        }
    };
}
