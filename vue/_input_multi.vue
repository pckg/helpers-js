<template>
    <div class="input-group">

        <input type="text" readonly value="default" class="form-control" v-if="!myValue || myValue.length === 0"/>
        <input type="text" readonly v-model="options.static[myValue]" class="form-control"
               v-else-if="myValue.indexOf('--') === 0"/>

        <input v-else type="number" class="form-control" v-model="myCustomValue" min="1" max="999" step="1"/>

        <span class="input-group-addon">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
               aria-haspopup="true"
               aria-expanded="false" title="View more options">
                <span v-if="options.dynamic[myValue]">{{ options.dynamic[myValue] }}</span>
                <i v-else class="far fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu">
                <li>
                    <a href="#" @click.prevent="select('')">
                        default
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.preset || {}).length > 0"></li>
                <li v-for="(option, c) in options.preset || {}">
                    <a href="#" @click.prevent="select(c, 'preset')">
                        {{ option }}
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.static || {}).length > 0"></li>
                <li v-for="(option, c) in options.static || {}">
                    <a href="#" @click.prevent="select(c, 'static')">
                        {{ option }}
                    </a>
                </li>
                <li role="separator" class="divider" v-if="Object.keys(options.dynamic || {}).length > 0"></li>
                <li v-for="(option, v) in options.dynamic || {}">
                    <a href="#" @click.prevent="select(v, 'dynamic')">
                        {{ option }}
                    </a>
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'd-input-multi',
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
                myCustomValue: ''
            };
        },
        model: {
            prop: 'value'
        },
        watch: {
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
                },
                myCustomValue: function (newVal) {
                    this.$emit('input', newVal + this.myValue);
                }
            }
        },
        methods: {
            select: function (value, type) {
                if (type == 'dynamic' || type == 'static') {
                    this.myValue = value;
                } else if (type == 'preset') {
                    this.myCustomValue = newVal.replace(/[^0-9.]/g, '');
                    this.myValue = newVal.replace(this.myCustomValue, '');
                }

                this.$emit('input', value);
            }
        }
    }
</script>