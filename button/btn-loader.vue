<template>
    <button class="btn" :class="button" @click.prevent="click" type="button" :disabled="disabled">
        <i class="fal fa-fw margin-right-xxs" :class="'fa-' + myIcon" v-if="myIcon"></i>
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        icon: {
            default: 'save'
        },
        button: {
            default: 'btn-primary'
        },
        disabled: {
            default: () => false,
        }
    },
    data: function () {
        return {
            myIcon: this.icon,
            defaultIcon: this.icon
        };
    },
    methods: {
        click: function () {
            this.myIcon = 'spinner-third fa-spin';

            this.$emit('click', {
                error: function () {
                    return new Promise(function (resolve, reject) {
                        this.myIcon = 'times';
                        resolve();
                    }.bind(this));
                }.bind(this),
                success: function () {
                    return new Promise(function (resolve, reject) {
                        this.myIcon = 'check';
                        setTimeout(function () {
                            this.myIcon = this.defaultIcon;
                            resolve();
                        }.bind(this), 1000);
                    }.bind(this));
                }.bind(this),
                reset: function () {
                    return new Promise(function (resolve, reject) {
                        this.myIcon = this.defaultIcon;
                        resolve();
                    }.bind(this));
                }.bind(this)
            });
        }
    },
    watch: {
        icon: function (newValue) {
            this.myIcon = newValue;
        }
    }
}
</script>
