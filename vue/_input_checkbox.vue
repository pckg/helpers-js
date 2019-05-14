<template>
    <span class="d-input-checkbox" :class="disabled ? 'is-disabled' : ''">
        <input type="checkbox" :name="name" :id="id" :value="value" :disabled="disabled" v-show="false"/>
        <i @click.prevent="toggleValue" :class="iconClass"></i>
        <label @click="toggleValue"><slot></slot></label>
    </span>
</template>

<script>
    export default {
        name: 'd-input-checkbox',
        props: {
            value: {
                default: true
            },
            id: {},
            disabled: {},
            name: {},
            selected: {}
        },
        model: {
            prop: 'selected'
        },
        watch: {
            selected: function (newVal) {
                this.cModel = newVal;
                this.$emit('change', newVal);
            }
        },
        data: function () {
            return {
                cModel: this.selected
            };
        },
        methods: {
            toggleValue: function () {
                if (this.disabled) {
                    return;
                }

                if (Array.isArray(this.cModel)) {
                    if (this.cModel.indexOf(this.value) >= 0) {
                        this.cModel.splice(this.cModel.indexOf(this.value), 1);
                    } else {
                        this.cModel.push(this.value);
                    }
                } else {
                    this.cModel = this.value == this.cModel ? null : this.value;
                }

                this.$emit('input', this.cModel);
            }
        },
        computed: {
            iconClass: function(){
                if (Array.isArray(this.cModel)) {
                    return this.cModel.indexOf(this.value) >= 0 ? 'fas fa-check-square' : 'fal fa-square';
                }

                return this.cModel == this.value ? 'fas fa-check-square' : 'fal fa-square';
            }
        }
    }
</script>