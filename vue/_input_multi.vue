<template>
    <div class="d-input-multi input-group"
         :class="componentClass"
         @click="toggleComponent"
         v-outer-click="onBodyClick">

        <template v-if="!myValue || myValue.length === 0">
            <span v-if="myParentValueReadable"
                  class="__input-value --parent cursor-pointer color-grayish">{{ myParentValueReadable }}</span>

            <span v-else
                  class="__input-value --default cursor-pointer color-grayish-opacity">default</span>
        </template>

        <span v-else-if="myValue.indexOf('--') === 0"
              class="__input-value --variable cursor-pointer">{{ options.static[myValue] }}</span>

        <span v-else-if="['0', 'auto'].indexOf(myValue) >= 0"
              class="__input-value --preset cursor-pointer">{{ myValue }}</span>

        <input v-else
               type="text"
               class="form-control"
               v-model="myCustomValue"/>

        <span class="input-group-addon" :class="open ? 'open' : ''">
            <a href="#" class="dropdown-toggle" title="View more options"
               @click.prevent.stop="toggleComponent">
                <span v-if="options.dynamic[myValue]">{{ options.dynamic[myValue] }}</span>
                <i v-else class="__more-icon far fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-right">
                <li>
                    <a href="#" @click.prevent.stop="select(null)">
                        default
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.preset || {}).length > 0"></li>
                <li v-for="(option, c) in options.preset || {}"
                    :class="c === `${myCustomValue}${myValue}` ? 'is-active' : ''"
                    @click.prevent.stop="select(c, 'preset')">
                    <a href="#" @click.prevent>
                        {{ option }}
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.static || {}).length > 0"></li>
                <li v-for="(option, c) in options.static || {}" :class="c === myValue ? 'is-active' : ''"
                    @click.prevent.stop="select(c, 'static')">
                    <a href="#" @click.prevent>
                        {{ option }}
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.dynamic || {}).length > 0"></li>
                <li v-for="(option, v) in options.dynamic || {}" :class="c === myValue ? 'is-active' : ''"
                    @click.prevent.stop="select(v, 'dynamic')">
                    <a href="#" @click.prevent>
                        {{ option }}
                    </a>
                </li>
            </ul>
        </span>

        <template v-if="slider">
            <span class="__slider">
                <input type="range"
                       :min="slider.min"
                       :max="slider.max"
                       v-model="myCustomValue"
                       :disabled="['px','deg','%'].indexOf(myValue) === -1" />
            </span>
            <span class="__remove">
                <a href="#" @click.prevent="$emit('remove')"><i class="fal fa-fw fa-trash"></i></a>
            </span>
        </template>

    </div>
</template>

<script>
    export default {
        name: 'd-input-multi',
        mixins: [{
            props: {
                parentValue: {
                    default: null
                },
            },
            watch: {
                parentValue: function (value) {
                    this.myParentValue = value;
                }
            }
        }],
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        preset: {},
                        dynamic: {},
                        static: {},
                    };
                }
            },
            slider: {
                default: false
            },
            value: {
                default: ''
            },
            isRequired: {
                default: false
            }
        },
        data: function () {
            return {
                myValue: null,
                myParentValue: this.parentValue,
                myCustomValue: '',
                open: false
            };
        },
        model: {
            prop: 'value'
        },
        watch: {
            myCustomValue: function () {
                this.emitValue();
            },
            value: {
                immediate: true, handler: function (newVal) {
                    if (!newVal || newVal.length === 0 || newVal.indexOf('--') === 0) {
                        this.myCustomValue = '';
                        this.myValue = newVal;
                        return;
                    }

                    let found = false;
                    $.each(this.options.dynamic, function (key, title) {
                        if (newVal.indexOf(key) > 0) {
                            this.myValue = key;
                            this.myCustomValue = newVal.substring(0, newVal.indexOf(key));
                            found = true;
                            return false;
                        }
                    }.bind(this));

                    if (found) {
                        return;
                    }

                    $.each(this.options.preset, function (key, title) { // 0, 10px
                        if (newVal === key) {
                            if (['0', 'auto'].indexOf(key) >= 0) {
                                this.myValue = key;
                                this.myCustomValue = '';
                            } else {
                                this.select(key, 'preset');
                            }
                            found = true;
                            return false;
                        }
                    }.bind(this));
                },
                myCustomValue: function (newVal) {
                    this.emitValue();
                }
            }
        },
        methods: {
            select: function (value, type) {
                /**
                 * Static value: --var-sth
                 */
                if (type === 'static') {
                    this.myValue = value;
                    this.myCustomValue = '';
                }

                /**
                 * Dynamic value: px
                 */
                if (type === 'dynamic') {
                    this.myValue = value;
                    if (this.myCustomValue.length === 0) {
                        this.myCustomValue = '10';
                    }
                }

                /**
                 * Preset value: 10px
                 */
                if (type === 'preset') {
                    this.myValue = value.replace(this.myCustomValue, '');
                    this.myCustomValue = value.replace(/[^0-9.]/g, '');
                }

                /**
                 * Reset
                 */
                if (!type) {
                    this.myValue = '';
                    this.myCustomValue = '';
                }

                this.emitValue();
                this.open = false;
            },
            emitValue: function () {
                this.$emit('input', `${this.myCustomValue}${this.myValue}`);
            },
            toggleComponent: function (e) {
                if (e.target.tagName === 'INPUT') {
                    return;
                }
                this.open = !this.open;
            },
            onBodyClick: function (e) {
                if (!this.open) {
                    return;
                }

                if ($(e.target).closest(this.$el).length > 0) {
                    return;
                }

                this.open = false;
            }
        },
        computed: {
            componentClass: function () {
                let c = [];
                if (!this.myValue || this.myValue.length === 0 || this.myValue.indexOf('--') === 0) {
                    c.push('cursor-pointer');
                }

                if (this.slider) {
                    c.push('--has-slider');
                }

                return c;
            },
            myParentValueReadable: function () {
                if (!this.myParentValue) {
                    return null;
                }

                if (this.myParentValue.indexOf('--') === 0) {
                    return this.options.static[this.myParentValue];
                }

                if (['0', 'auto'].indexOf(this.myParentValue) >= 0) {
                    return this.myParentValue;
                }

                return this.myParentValue;
            }
        }
    }
</script>