<template>
    <span class="d-input-radio" :class="disabled ? 'disabled' : ''">
        <input type="radio" :name="name" :id="id" :value="value" :disabled="disabled"/>
        <i @click.prevent="setValue"
           :class="cModel == this.value ? 'fas fa-dot-circle' : 'far fa-circle'"></i>
        <label v-if="label && label.length > 0" @click.prevent="setValue">{{ label }}</label>
    </span>
</template>

<script>
    export default {
        name: 'd-input-radio',
        props: {
            value: {},
            id: {},
            disabled: {},
            name: {},
            selected: {},
            label: {},
        },
        model: {
            prop: 'selected'
        },
        watch: {
            selected: function (newVal) {
                this.cModel = newVal;
            }
        },
        data: function () {
            return {
                cModel: this.selected
            };
        },
        methods: {
            setValue: function () {
                if (this.cModel == this.value) {
                    this.cModel = null;
                    this.$emit('input', null);
                    return;
                }

                if (this.disabled) {
                    return;
                }

                this.cModel = this.value;
                this.$emit('input', this.cModel);
            }

        }
    }
</script>