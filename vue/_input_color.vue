<template>
    <span class="d-input-color" :class="{'active' : visible}">
        <span @click.prevent="handleClick" class="__preview" :style="{'background-color':myValue}"></span>
        <input type="text" v-model="myValue" class="model" :placeholder="myParentValue"/>
        <span class="over" :class="{'--right' : rightClass} " v-if="visible">
            <div class="as-table align-top">
                <div>
                    <color-picker v-model="myValue" :width="180" :height="180"></color-picker>
                </div>
                <div class="flex-wrap u-align-spaced margin-left-xs">
                    <span v-for="color in palette"
                          @click.prevent="selectColor(color)"
                          class="__sample" :style="{backgroundColor: color}"
                          :title="color"></span>
                </div>
            </div>
        </span>
        <div class="clearfix"></div>
    </span>
</template>

<script>
    export default {
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
            value: {
                default: null
            },
            palette: {
                default: function () {
                    return [];
                }
            }
        },
        watch: {
            value: function (value) {
                this.myValue = value;
            },
            myValue: function (value) {
                this.$emit('input', value);
            },
        },
        model: {
            prop: 'value',
        },
        data: function () {
            return {
                myValue: this.value,
                visible: false,
                rightClass: false,
                myParentValue: this.parentValue
            };
        },
        methods: {
            checkCloseTrigger: function (e) {
                if ($(e.target).closest('.d-input-color').is($(this.$el))) {
                    return;
                }

                this.visible = false;
            },
            handleClick: function (event) {
                let elementLeft = event.target.getBoundingClientRect().left,
                    windowRight = document.body.getBoundingClientRect().right,
                    offset = windowRight - elementLeft;

                if (offset < 320) { // width of the `.over` element plus some additional security buffer (padding)
                    this.rightClass = true;
                }

                this.visible = !this.visible;
            },
            selectColor: function (color) {
                this.myValue = color;
            }
        },
        mounted: function () {
            $('body').on('click', this.checkCloseTrigger);
        },
        beforeDestroy: function () {
            $('body').off('click', this.checkCloseTrigger);
        }
    }
</script>