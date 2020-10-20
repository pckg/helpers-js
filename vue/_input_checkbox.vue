<template>
    <span class="d-input-checkbox" :class="[disabled ? 'is-disabled' : '', isSelected ? '--selected' : '']">
        <label class="__checkbox-label"
               @click="toggleValue">
            <i class="__checkbox-icon fa-fw"
               :class="iconClass"></i>
                <slot></slot>
        </label>
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
            selected: {},
            options: {
                default: function () {
                    return {
                        classes: {
                            multiple: {
                                active: 'fas fa-check-square',
                                inactive: 'fal fa-square'
                            },
                            single: {
                                active: 'fas fa-check-square',
                                inactive: 'fal fa-square'
                            }
                        }
                    };
                }
            }
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
            isSelected: function(){
                return Array.isArray(this.cModel)
                    ? (this.cModel.indexOf(this.value) >= 0)
                    : (this.cModel == this.value);
            },
            iconClass: function () {
                let c = this.options.classes;
                if (Array.isArray(this.cModel)) {
                    return this.isSelected ? c.multiple.active : c.multiple.inactive;
                }

                return this.isSelected ? c.single.active : c.single.inactive;
            }
        }
    }
</script>