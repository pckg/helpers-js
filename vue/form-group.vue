<template>
    <div class="c-form-group form-group"
         :class="$refs.validatorComponent && $refs.validatorComponent.isVisible ? '--has-error' : ''">
        <div class="__form-label-holder" v-if="label || (translatable && localeDropdown)">

            <label v-if="label || tooltip">
                {{ myOptions.required ? asterisk : '' }}{{ label }}
                <pckg-tooltip v-if="tooltip" icon="question-circle" icon-style="fal" :content="tooltip"></pckg-tooltip>
            </label>

            <pckg-locale-dropdown v-if="translatable && localeDropdown"></pckg-locale-dropdown>

        </div>
        <div class="__form-element-holder" :class="help ? '--with-help' : ''">
            <slot v-if="$slots.element" name="element"></slot>
            <div v-else-if="type === 'raw'" v-html="myValue"></div>
            <div v-else-if="type === 'encoded'"
                 :class="!myValue || myValue.length === 0 ? 'color-grayish' : ''">{{ myComputedValue && myComputedValue.length > 0 ? myComputedValue : placeholder }}</div>
            <pckg-select v-else-if="type === 'select:single'"
                         :initial-options="myOptions.options"
                         :initial-multiple="false"
                         v-model="myValue"
                         :class="myOptions.className || ''"
                         :has-search="!myOptions.noSearch"
                         :parent-value="myOptions.parent"></pckg-select>
            <pckg-select v-else-if="type === 'select:multiple'"
                         :initial-options="myOptions.options"
                         :initial-multiple="true"
                         v-model="myValue"
                         :class="myOptions.className || ''"
                         :has-search="!myOptions.noSearch"
                         :parent-value="myOptions.parent"></pckg-select>
            <d-input-toggle v-else-if="type === 'toggle'"
                            :off="myOptions.off || false"
                            :on="myOptions.on || true"
                            :is-disabled="myOptions.disabled || false"
                            v-model="myValue"
                            :class="myOptions.className || ''"></d-input-toggle>
            <d-select-pills v-else-if="type === 'pills'"
                            v-model="myValue"
                            :class="myOptions.className || ''"
                            :required="myOptions.required"
                            :options="myOptions.options || {}"
                            :icon="myOptions.icon || false"
                            :parent-value="myOptions.parent"></d-select-pills>
            <d-input-color v-else-if="type === 'color'"
                           v-model="myValue"
                           :class="myOptions.className || ''"
                           :palette="myOptions.palette || []"
                           :parent-value="myOptions.parent"></d-input-color>
            <d-input-multi v-else-if="type === 'multi'"
                           v-model="myValue"
                           :parent-value="options.parent"
                           :class="myOptions.className || ''"
                           :options="myOptions.options || {}"
                           :slider="myOptions.slider || false"
                           @remove="$emit('remove')"></d-input-multi>
            <!-- used in maestro? -->
            <pckg-htmlbuilder-dropzone v-else-if="type === 'picture'"
                                       v-model="myValue"></pckg-htmlbuilder-dropzone>
            <input v-else-if="type === 'text'"
                   class="form-control"
                   type="text"
                   :name="name"
                   v-model="myComputedValue"
                   :placeholder="placeholder"
                   :id="myOptions.id || null"
                   :disabled="myOptions.disabled || false"
                   :class="myOptions.className || ''"/>
            <input v-else-if="type === 'email'"
                   class="form-control"
                   type="email"
                   v-model="myValue"
                   :placeholder="placeholder"
                   :class="myOptions.className || ''"/>
            <template v-else-if="type === 'number'">
                <div class="input-group" v-if="$slots.prefix || $slots.suffix">
                    <slot v-if="$slots.prefix" name="prefix"></slot>
                    <input class="form-control"
                           type="number"
                           v-model="myValue"
                           :placeholder="placeholder"
                           :class="myOptions.className || ''"/>
                    <slot v-if="$slots.suffix" name="suffix"></slot>
                </div>
                <input v-else class="form-control"
                       type="number"
                       v-model="myValue"
                       :placeholder="placeholder"
                       :class="myOptions.className || ''"/>
            </template>
            <input v-else-if="type === 'password'"
                   class="form-control"
                   type="password"
                   v-model="myValue"
                   :placeholder="placeholder"
                   :class="myOptions.className || ''"/>
            <input v-else-if="type === 'hidden'"
                   type="hidden"
                   v-model="myValue"/>
            <textarea v-else-if="type === 'textarea'"
                      class="form-control"
                      v-model="myValue"
                      :placeholder="placeholder"
                      :class="myOptions.className || ''"></textarea>
            <pckg-datetime-picker v-else-if="type === 'datetime'"
                                  v-model="myValue" :class="myOptions.className || ''"
                                  :placeholder="placeholder"
                                  :options="{format: 'YYYY-MM-DD HH:mm', type: 'datetime'}"></pckg-datetime-picker>
            <pckg-datetime-picker v-else-if="type === 'date'"
                                  v-model="myValue" :class="myOptions.className || ''"
                                  :placeholder="placeholder"
                                  :options="{format: 'YYYY-MM-DD', type: 'date'}"></pckg-datetime-picker>
            <pckg-datetime-picker v-else-if="type === 'time'"
                                  v-model="myValue" :class="myOptions.className || ''"
                                  :placeholder="placeholder"
                                  :options="{format: 'HH:mm', type: 'time'}"></pckg-datetime-picker>
            <google-font-selector v-else-if="type === 'google-font'"
                                  v-model="myValue"
                                  :class="myOptions.className || ''"
                                  @variant="$emit('variant', $event)"
                                  @available-variants="$emit('available-variants', $event)"></google-font-selector>

            <template v-else-if="type === 'checkbox'">
                <d-input-checkbox v-model="myValue"
                                  :value="myOptions.value || 1">{{ myOptions.title }}
                </d-input-checkbox>
            </template>

            <!-- checkboxes -->
            <template v-else-if="type === 'checkboxes'">
                <div class="display-block" v-for="(title, key, i) in myOptions.options">
                    <d-input-checkbox v-model="myValue"
                                      :value="key"
                                      :index="alphaIndex(i)"
                                      :design="myOptions.design || null">{{ title }}</d-input-checkbox>
                </div>
            </template>

            <!-- radios -->
            <template v-else-if="type === 'radios'">
                <div class="display-block" v-for="(title, key, i) in myOptions.options">
                    <d-input-radio v-model="myValue"
                                   :value="key"
                                   :label="title"
                                   :index="alphaIndex(i)"
                                   :design="myOptions.design || null"></d-input-radio>
                </div>
            </template>

            <!-- picture -->
            <pckg-htmlbuilder-dropzone v-else-if="type === 'file:picture'"
                                       :url="myOptions.url || null"
                                       :params="myOptions.params || {}"
                                       :current="myOptions.current || null"
                                       :id="myOptions.id"
                                       @uploaded="$emit('uploaded', $event)"
                                       v-model="myValue"></pckg-htmlbuilder-dropzone>

            <!-- document -->
            <pckg-htmlbuilder-dropzone v-else-if="type === 'file:document'"
                                       :url="myOptions.url || null"
                                       :params="myOptions.params || {}"
                                       :options="myOptions.options || {maxSize: 2, manualProcess: false}"
                                       :id="myOptions.id"
                                       @uploaded="$emit('uploaded', $event)"
                                       v-model="myValue"
                                       ref="uploader"></pckg-htmlbuilder-dropzone>

            <!-- custom file -->
            <pckg-htmlbuilder-dropzone v-else-if="type === 'file:custom'"
                                       :url="myOptions.url || null"
                                       :params="myOptions.params || {}"
                                       :id="myOptions.id"
                                       @uploaded="$emit('uploaded', $event)"
                                       v-model="myValue"></pckg-htmlbuilder-dropzone>

            <!-- editor -->
            <pckg-htmleditor v-else-if="type === 'editor'" v-model="myValue"></pckg-htmleditor>

        </div>
        <slot v-if="$slots.help" name="help" class="help"></slot>
        <div v-else-if="help" class="help" v-html="help"></div>
        <htmlbuilder-validator-error v-if="name && errors"
                                     :bag="errors"
                                     ref="validatorComponent"
                                     :name="name"></htmlbuilder-validator-error>
    </div>
</template>

<script>
export default {
    name: 'form-group',
    inject: ['$validator'],
    props: {
        type: {
            type: String,
            required: true
        },
        value: {},
        help: {
            default: null
        },
        label: {
            type: String,
        },
        name: {
            type: String,
        },
        options: {
            default: function () {
                return {};
            }
        },
        tooltip: {
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        translatable: {
            default: false
        },
        localeDropdown: {
            default: true
        },
        asterisk: {
            default: '* '
        }
    },
    model: {
        prop: 'value'
    },
    data: function () {
        return {
            myValue: this.value,
            myOptions: this.options,
        };
    },
    watch: {
        value: function (newVal) {
            this.myValue = newVal;
        },
        myValue: function (newVal) {
            this.$emit('input', newVal);
        },
        options: {
            deep: true,
            handler: function (newVal) {
                this.myOptions = newVal;
            }
        },
    },
    methods: {
        alphaIndex: function(index){
            return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z'][index] || null;
        },
    },
    computed: {
        defaultLocale: function(){
            return this.$store.state.config.config.locale.default;
        },
        currentLocale: function(){
            return this.$store.state.config.config.locale.current;
        },
        myComputedValue: {
            get: function () {
                if (!this.myValue) {
                    return this.myValue;
                }

                if (typeof this.myValue === 'object') {
                    return this.myValue[this.currentLocale];
                }

                return this.myValue;
            },
            set: function (value) {
                let currentValue = this.myValue;
                if (this.translatable && typeof currentValue !== 'object') {
                    let tempValue = {};
                    tempValue[this.defaultLocale] = currentValue;
                    currentValue = tempValue;
                }

                if (this.translatable && typeof currentValue === 'object') {
                    currentValue[this.currentLocale] = value;
                    this.myValue = currentValue;
                    return;
                }

                this.myValue = value;
            }
        }
    }
}
</script>