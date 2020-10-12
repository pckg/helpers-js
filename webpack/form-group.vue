<template>
    <div class="form-group">
        <label v-if="$slots.label || label">
            <slot name="label" :my-value="myValue"></slot>
            {{ label }}
        </label>
        <div class="flex-row">
            <div v-if="prefix" class="flex-item">{{ prefix }}</div>
            <div class="--auto">
                <input v-if="isInput" :type="type" class="form-control" :name="name" :placeholder="placeholder"
                       v-model="myValue"/>
                <slot v-else-if="type === 'slot'" name="slot" :my-value="myValue"></slot>
                <select v-else-if="type === 'select:multiple'" multiple :name="name" class="form-control">
                    <option>{{ placeholder }}</option>
                    <option v-for="(val, key) in myOptions.options" :value="key">{{ val }}</option>
                </select>
                <textarea v-else-if="type === 'textarea'" :name="name" class="form-control">{{ myValue }}</textarea>
            </div>
        </div>
        <htmlbuilder-validator-error v-if="name && $parent.errors"
                                     :bag="$parent.errors"
                                     ref="validatorComponent"
                                     :name="name"></htmlbuilder-validator-error>
    </div>
</template>

<script>
import HtmlbuilderValidatorError
    from "../../../../vendor/pckg/htmlbuilder/src/Pckg/Htmlbuilder/View/htmlbuilderValidatorError.vue";

export default {
    inject: ['$validator'],
    components: {HtmlbuilderValidatorError},
    props: {
        label: {
            default: null
        },
        placeholder: {
            default: null
        },
        prefix: {
            default: null
        },
        name: {
            default: null
        },
        value: {
            default: null
        },
        type: {
            default: 'text'
        },
        options: {
            default: function () {
                return {};
            }
        }
    },
    model: {
        prop: 'value'
    },
    watch: {
        value: function (newValue) {
            this.myValue = newValue;
        },
        options: function (newValue) {
            this.myOptions = newValue;
        },
        myValue: function () {
            this.$emit('input', this.myValue);
        }
    },
    data: function () {
        return {
            myValue: this.value,
            myOptions: this.options || {}
        };
    },
    computed: {
        isInput: function () {
            return ['text', 'email', 'number', 'datetime'].indexOf(this.type) >= 0;
        }
    }
}
</script>