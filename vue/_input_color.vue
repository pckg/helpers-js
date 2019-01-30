<template>
    <span class="d-input-color">
        <span @click.prevent="visible = !visible" class="preview" :style="{'background-color':myValue}"></span>
        <input type="text" v-model="myValue" class="model"/>
        <span class="over" v-if="visible">
            <color-picker v-model="myValue" :width="240" :height="240"></color-picker>
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
        data: function () {
            return {
                myValue: this.value,
                visible: false
            };
        },
        methods: {
            checkCloseTrigger: function (e) {
                if ($(e.target).closest('.d-input-color').is($(this.$el))) {
                    return;
                }

                this.visible = false;
            }
        },
        mounted: function () {
            $('body').on('click', this.checkCloseTrigger);
        },
        beforeDestroy: function () {
            $('body').off('click', this.checkCloseTrigger);
        },
    }
</script>