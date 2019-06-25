<template>
    <div class="c-input-numpad width-xs margin-0-auto">

        <div class="as-table table-fixed">
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(1)">1</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(2)">2</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(3)">2</button>
            </div>
        </div>

        <div class="as-table table-fixed">
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(4)">4</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(5)">5</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(6)">6</button>
            </div>
        </div>

        <div class="as-table table-fixed">
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(7)">7</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(8)">8</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(9)">9</button>
            </div>
        </div>

        <div class="as-table table-fixed">
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="addTwo(0)">
                    .00
                </button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="add(0)">0</button>
            </div>
            <div>
                <button type="button" class="btn btn-default btn-lg btn-block" @click.prevent="remove">Delete
                </button>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'd-input-numpad',
        props: {
            value: {
                required: true
            }
        },
        watch: {
            value: function (value) {
                this.setValue(this.parseValue(value));
            }
        },
        model: {
            event: 'input'
        },
        data: function () {
            return {
                myValue: this.parseValue(this.value)
            };
        },
        methods: {
            setValue: function (value) {
                console.log('set value', value);
                this.myValue = value;
                this.emitValue();
            },
            parseValue: function (value) {
                value = parseFloat(value) || parseFloat(0.0);

                /**
                 * Make 2 decimals.
                 * Remove ..
                 */
                let found = false;
                value = value.toFixed(3).split('').reverse().slice(1).reverse().filter(function (item) {
                    return item !== '.';
                })

                return value;
            },
            addTwo: function (num) {
                this.add(num);
                this.add(num);
            },
            add: function (num) {
                if (num === 0 && this.myValue.length === 0) {
                    return;
                }

                this.myValue.push(num);
                this.emitValue();
            },
            remove: function () {
                if (this.myValue.length === 1) {
                    this.myValue = [];
                    return;
                }

                this.setValue(this.myValue.slice(0, this.myValue.length - 1));
            },
            emitValue: function () {
                this.$emit('input', this.formattedValue)
            }
        },
        computed: {
            formattedValue: function () {
                if (this.myValue.length === 0) {
                    return '0.00';
                }

                return this.myValue.slice(0, this.myValue.length - 2).join('') + '.' + this.myValue.slice(this.myValue.length - 2).join('');
            }
        }
    }
</script>