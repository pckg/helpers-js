<template>
    <div class="input-group">

        <div class="form-control color-grayish" v-if="!myValue || myValue.length === 0">default</div>
        <div class="form-control" v-else-if="myValue.indexOf('@') === 0">
            {{ options.static[myValue] }}
        </div>
        <input v-else type="number" class="form-control" v-model="myCustomValue" min="1" max="999" step="1"/>

        <span class="input-group-addon">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
               aria-haspopup="true"
               aria-expanded="false" title="View more options">
                <span v-if="options.dynamic[myValue]">{{ options.dynamic[myValue] }}</span>
                <i class="fa fa-fw fa-chevron-down" v-else></i>
            </a>
            <ul class="dropdown-menu">
                <li>
                    <a href="#" @click.prevent="select('')">
                        default
                    </a>
                </li>
                <li role="separator" class="divider"></li>
                <li v-for="(option, c) in options.static">
                    <a href="#" @click.prevent="select(c, 'static')">
                        {{ option }}
                    </a>
                </li>
                <li role="separator" class="divider"></li>
                <li v-for="(option, v) in options.dynamic">
                    <a href="#" @click.prevent="select(v, 'dynamic')">
                        {{ option }}
                    </a>
                </li>
            </ul>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'd-input-multi',
        props: {
            options: {
                type: Object,
                default: function () {
                    return {
                        static: {},
                        dynamic: {},
                    };
                }
            },
            value: {
                default: ''
            }
        },
        data: function () {
            return {
                myValue: this.value,
                myCustomValue: ''
            };
        },
        model: {
            prop: 'value'
        },
        watch: {
            value: function (newVal) {
                if ((newVal && newVal.indexOf('@') === 0) || !newVal) {
                    console.log('first var', newVal);
                    this.myCustomValue = '';
                    this.myValue = newVal;
                    return;
                }

                if (newVal.length === 0) {
                    console.log('second null', newVal);
                    this.myCustomValue = '';
                    this.myValue = '';
                    return;
                }

                console.log('third custom', newVal);
                this.myCustomValue = newVal.replace(/[^0-9.]/g, "")
                this.myValue = newVal.replace(this.myCustomValue + '', '');
            },
            myCustomValue: function (newVal) {
                this.$emit('input', newVal + this.myValue);
            }
        },
        methods: {
            select: function (value, type) {
                this.myValue = value;

                if (!value) {
                    this.myCustomValue = '';
                    this.$emit('input', this.myValue);
                    return;
                }

                if (value.indexOf('@') !== 0) {
                    this.$emit('input', this.myCustomValue + this.myValue);
                    return;
                }

                this.$emit('input', this.myValue);
                this.$nextTick(function () {
                    $(this.$el).find('input.form-control').focus();
                }.bind(this));
            }
        }
    }
</script>