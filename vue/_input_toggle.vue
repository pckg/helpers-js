<template>
    <span class="d-input-toggle" :class="myDisabled ? '--disabled' : ''">
        <i :class="iconClass" @click.prevent="toggle" :title="iconTitle"></i>
    </span>
</template>

<script>
    export default {
        name: 'd-input-toggle',
        props: {
            value: {},
            off: {
                default: false
            },
            on: {
                default: true
            },
            isDisabled: {
                default: false
            }
        },
        model: {
            prop: 'value'
        },
        watch: {
            value: function (value) {
                this.myValue = value;
            },
            isDisabled: function (value) {
                this.myDisabled = value;
            }
        },
        data: function () {
            return {
                myValue: this.value,
                myDisabled: this.isDisabled,
            };
        },
        methods: {
            toggle: function () {
                if (this.myDisabled) {
                    return;
                }

                this.myValue = this.myValue === this.on ? this.off : this.on;
                this.$emit('input', this.myValue);
            }
        },
        computed: {
            iconClass: function () {
                if (this.myDisabled) {
                    return 'fal fa-toggle-off color-grayish';
                }

                return this.myValue === this.on ? 'fal fa-toggle-on clr-secondary' : 'fal fa-rotate-180 fa-toggle-on color-grayish';
            },
            iconTitle: function () {
                return this.myValue === this.on ? this.on : this.off;
            }
        }
    }
</script>