<script>
import {
    inComponentCompiler,
    render
} from "./inComponent.compiler.js";

export default {
    render,
    watch: {
        '$route': {
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                console.log('Route has changed, recompiling vue:route:template', newVal);
                inComponentCompiler.call(this, newVal.meta.tags['vue:route:template']);
            }
        }
    },
}
</script>
