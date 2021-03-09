<template>
    <div class="form-group">
        <label v-if="$slots.label || label" :for="uuidName">
            <slot name="label" :my-value="myValue"></slot>
            {{ label }}
        </label>
        <div class="flex-row">
            <div v-if="prefix" class="flex-item">{{ prefix }}</div>
            <div class="--auto">
                <slot name="element" v-if="$slots.element"></slot>
                <span v-else-if="formMode === 'view'">{{ myValue }}</span>
                <pckg-datetime-picker v-else-if="isDateTimePicker"
                                      v-model="myValue"
                                      :placeholder="placeholder"
                                      :options="{format: datetimeFormat, type: type}"></pckg-datetime-picker>
                <input v-else-if="isInput" :type="type" class="form-control" :name="name" :id="uuidName"
                       :placeholder="placeholder"
                       v-model="myValue"/>
                <slot v-else-if="type === 'slot'" name="slot" :my-value="myValue"></slot>
                <select v-else-if="type === 'select:multiple'" multiple :name="name" class="form-control"
                        v-model="myValue">
                    <option>{{ placeholder }}</option>
                    <option v-for="(val, key) in myOptions.options" :value="getOptionValue(val, key)">
                        {{ getOptionName(val, key) }}
                    </option>
                </select>
                <select v-else-if="type === 'select:single'" :name="name" class="form-control" v-model="myValue">
                    <option>{{ placeholder }}</option>
                    <option v-for="(val, key) in myOptions.options" :value="getOptionValue(val, key)">
                        {{ getOptionName(val, key) }}
                    </option>
                </select>
                <textarea v-else-if="type === 'textarea'" :name="name" class="form-control">{{ myValue }}</textarea>
                <pckg-htmleditor v-else-if="type === 'editor'"
                                 :name="name"
                                 :id="uuidName"
                                 :variables="editorVariables"
                                 v-model="myValue"></pckg-htmleditor>
                <span v-else-if="type === 'encoded'">{{ myValue }}</span>
            </div>
        </div>
        <div v-if="help" v-html="help" class="__help-text"></div>
        <htmlbuilder-validator-error v-if="name && $parent.errors"
                                     :bag="$parent.errors"
                                     ref="validatorComponent"
                                     :name="name"></htmlbuilder-validator-error>
    </div>
</template>

<script>
import HtmlbuilderValidatorError
    from "../../../../vendor/pckg/htmlbuilder/src/Pckg/Htmlbuilder/View/htmlbuilderValidatorError.vue";

import {v4} from "uuid";

export default {
    inject: ['$validator', 'formMode'],
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
        help: {
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
            myOptions: this.options || {},
            uuid: v4()
        };
    },
    computed: {
        isDateTimePicker() {
            return ['date', 'time', 'datetime'].indexOf(this.type) >= 0;
        },
        isInput: function () {
            return ['text', 'email', 'number', 'password'].indexOf(this.type) >= 0;
        },
        uuidName: function () {
            return this.name + '_' + this.uuid;
        },
        editorVariables: function () {
            return (this.options && this.options.editor && this.options.editor.variables) || [];
        },
        datetimeFormat: function () {
            return {
                datetime: 'YYYY-MM-DD HH:mm',
                date: 'YYYY-MM-DD',
                time: 'HH:mm',
            }[this.type]
        }
    },
    methods: {
        getOptionValue: function (val, key) {
            if (typeof val === 'object') {
                return val.value;
            }

            return key;
        },
        getOptionName: function (val, key) {
            if (typeof val === 'object') {
                return val.name;
            }

            return val;
        },
    }
}
</script>
