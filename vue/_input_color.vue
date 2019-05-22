<template>
    <span class="d-input-color" :class="{'active' : visible}">
        <span @click.prevent="handleClick" class="preview" :style="{'background-color':myValue}"></span>
        <input type="text" v-model="myValue" class="model"/>
        <span class="over" :class="{'--right' : rightClass} "v-if="visible">
            <div class="as-table align-top">
                <div>
                    <color-picker v-model="myValue" :width="180" :height="180"></color-picker>
                </div>
                <div class="flex-wrap u-align-spaced margin-left-xs">
                    <span v-for="color in colors" class="__sample" :style="{backgroundColor: color}"
                          :title="color"></span>
                </div>
            </div>
        </span>
        <div class="clearfix"></div>
    </span>
</template>

<script>
    export default {
        props: {
            value: {
                default: null
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
                rightClass: false
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
            }
        },
        mounted: function () {
            $('body').on('click', this.checkCloseTrigger);
        },
        beforeDestroy: function () {
            $('body').off('click', this.checkCloseTrigger);
        },
        computed: {
            designSettings: function () {
                return $store.state.settings.settings.design;
            },
            colors: function () {
                let designSettings = this.designSettings;
                let colors = {};

                colors[designSettings.vars.colorP] = designSettings.vars.colorP;
                colors[designSettings.vars.colorS] = designSettings.vars.colorS;
                $.each(designSettings.scopes, function (scope, vars) {
                    $.each(vars, function (i, color) {
                        colors[color] = color;
                    });
                });

                return Object.values(colors);
            }
        }
    }
</script>