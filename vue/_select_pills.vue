<template>
    <div class="d-select-pills">
        <span v-for="(option, key) in options" class="pill" :class="getOptionClass(key)"
              @click.prevent="selectOption(key)">
            <i v-if="icon" class="fa fa-fw" :class="'fa+' + option.icon" :title="option.title"></i>
            <template v-else>{{ option }}</template>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'd-select-pills',
        props: {
            options: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            multiple: {
                default: false,
            },
            value: {
                default: ''
            },
            required: {
                default: true
            },
            icon: {
                default: false
            }
        },
        data: function () {
            return {
                myOptions: this.options,
                myMultiple: this.multiple,
                myValue: this.value,
                myCustomValue: ''
            };
        },
        watch: {
            multiple: function (newVal) {
                this.myMultiple = newVal;
            },
            options: function (newVal) {
                this.myOptions = newVal;
            }
        },
        model: {
            prop: 'value'
        },
        methods: {
            selectOption: function (value) {
                if (this.myMultiple && this.myValue.indexOf(value) === -1) {
                    this.myValue.push(value);
                } else if (!this.myMultiple) {
                    if (this.myValue == value && !this.required) {
                        this.myValue = null;
                    } else {
                        this.myValue = value;
                    }
                } else if (!this.required) {
                    this.myValue = null;
                }

                this.$emit('value', this.myValue);
            },
            getOptionClass: function (value) {
                if (Array.isArray(this.myValue)) {
                    return this.myValue.indexOf(value) >= 0 ? 'active' : null;
                }

                return this.myValue == value ? 'active' : null;
            }
        }
    }
</script>