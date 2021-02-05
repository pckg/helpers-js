<template>
    <!-- default, incorrect? -->
    <span v-if="!wrap" class="d-input-radio" :class="[disabled ? 'disabled' : '', cModel === value ? '--selected' : '']">
        <span v-if="design === 'alphabetic'" class="__radio-icon-alpha" @click.prevent="setValue">{{ index }}</span>
        <i v-else
           @click.prevent="setValue"
           class="__radio-icon"
           :class="cModel == value ? 'fas fa-dot-circle' : 'fal fa-circle'"></i>
        <label v-if="(label && label.length > 0) || $slots.default"
               class="__radio-label"
               @click.prevent="setValue">{{ label }}<slot></slot></label>
    </span>
    <!-- alternative, better? -->
    <label v-else class="d-input-radio --wrapped" :class="[disabled ? 'disabled' : '', cModel === value ? '--selected' : '']"
           @click.prevent="setValue">
        <i class="__radio-icon"
           :class="cModel == value ? 'fas fa-dot-circle' : 'fal fa-circle'"></i>
        <span class="__radio-label" v-if="(label && label.length > 0) || $slots.default">{{ label }}<slot></slot></span>
    </label>
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
            wrap: {
                default: false
            },
            design: {
                default: 'default'
            },
            index: {
              default: null
            },
            required: {
                default: false
            }
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
                    if (this.required) {
                      return;
                    }
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