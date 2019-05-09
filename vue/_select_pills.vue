<template>
    <div class="d-select-pills">
        <span v-for="(option, key) in options" class="pill" :class="getOptionClass(key)"
              @click.prevent="selectOption(key)">{{ option }}</span>
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
                    this.myValue = value;
                }
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