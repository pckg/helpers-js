<script>
import {
    inComponentCompiler,
    inComponentRenderer
} from "./inComponent.compiler.js";

export default {
    render: function (h) {
        inComponentRenderer.call(this, h);
    },
    watch: {
        $route: {
            immediate: true,
            handler: function (newVal, oldVal) {
                inComponentCompiler.call(this, newVal.meta.tags['vue:route:template']);
            }
        }
    },
}
</script>
