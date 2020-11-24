<template>
    <div class="c-loader-indicator" :class="stateClass" :style="{width: width}"></div>
</template>

<style lang="less" scoped>
.c-loader-indicator {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 0;
    height: .5rem;
    background: linear-gradient(to left, var(--color-primary, var(--color-p)), var(--color-secondary, var(--color-s)));
    opacity: 0;
    cursor: progress;

    &.--in {
        opacity: 1;
    }
    &.--loading {
        transition: width 1000ms ease-in-out;
    }
    &.--loaded {
        transition: width .5s ease-in;
    }

    &.--out {
        opacity: 0;
        transition: none;
    }
}
</style>

<script>
export default {
    data: function () {
        return {
            percentage: 0,
            active: false
        };
    },
    computed: {
        width: function () {
            return this.active && this.percentage > 0 ? this.percentage + '%' : 0;
        },
        stateClass: function () {
            return [this.active ? '--in --loading' : '--out', this.percentage === 100 ? '--loaded' : ''];
        }
    },
    created: function () {
        $dispatcher.$on('page:loading', () => {
            this.percentage = 0;
            this.active = false;
            this.$nextTick(() => {
                this.percentage = 50;
                this.active = true;
            });
        });
        $dispatcher.$on('page:resolving', () => {
            this.percentage = 75;
        });
        $dispatcher.$on('page:loaded', () => {
            this.percentage = 100;
            setTimeout(() => {
                this.active = false;
            }, 1000);
        });
    }
}
</script>