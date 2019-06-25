<template>
    <div class="c-input-numpad">
        {{ formattedValue }}

        <div class="width-sm margin-0-auto">

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
                this.myValue = this.parseValue(value);
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
            parseValue: function (value) {
                value = parseFloat(value);

                /**
                 * Make 2 decimals.
                 * Remove ..
                 */
                value = value.toFixed(3).split('').reverse().slice(1).reverse().filter(function(item){
                    return typeof item === 'number';
                });

                if (value.length < 3) {
                    value = value.reverse();
                    while (value.length < 3) {
                        value.push(0);
                    }
                    value = value.reverse();
                }

                return value;
            },
            addTwo: function (num) {
                this.myValue.push(num);
                this.myValue.push(num);
            },
            add: function (num) {
                if (num === 0 && !this.myValue) {
                    return;
                }

                this.myValue.push(num);
            },
            remove: function () {
                if (this.myValue.length === 3) {
                    this.myValue = this.myValue.slice(0, 2).reverse().push(0).reverse();
                    return;
                }

                this.myValue = this.myValue.slice(0, this.myValue.length - 1);
            }
        },
        computed: {
            formattedValue: function () {
                return this.myValue.slice(0, this.myValue.length - 2) + '.' + this.myValue.slice(this.myValue.length - 2);
            }
        }
    }
</script>