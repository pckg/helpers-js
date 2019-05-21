<template>
    <span class="d-input-toggle">
        <i class="fal fa-2x" :class="iconClass" @click.prevent="toggle" :title="iconTitle"></i>
    </span>
</template>

<script>
    export default {
        name: 'd-input-toggle',
        props: {
            value: {
                required: true
            },
            off: {
                default: false
            },
            on: {
                default: true
            }
        },
        model: {
            prop: 'value'
        },
        watch: {
            value: function (value) {
                this.myValue = value;
            }
        },
        data: function () {
            return {
                myValue: this.value
            };
        },
        methods: {
            toggle: function () {
                this.myValue = this.myValue == this.on ? this.off : this.on;
                this.$emit('input', this.myValue);
            }
        },
        computed: {
            iconClass: function () {
                return this.myValue == this.on ? 'fa-toggle-on clr-primary' : 'fa-toggle-off';
            },
            iconTitle: function () {
                return this.myValue == this.on ? this.on : this.off;
            }
        }
    }
</script>