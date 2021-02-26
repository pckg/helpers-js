<template>
    <div class="c-loader-indicator" :class="stateClass"></div>
</template>

<style lang="less" scoped>
.c-loader-indicator {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 0;
    height: .4rem;
    background: linear-gradient(to left, var(--color-primary, var(--color-p)), var(--color-secondary, var(--color-s)));
    opacity: 0;
    cursor: progress;
    width: 25%;

    &.--in {
        opacity: 1;
        animation: slideright 2s infinite;
    }

    &.--out {
        opacity: 0;
    }

    &.loaded {
        transition: all 333ms ease-in-out;
    }
}

@keyframes slideright {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
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
        stateClass: function () {
            return [this.active ? '--in --loading' : '--out', this.percentage === 100 ? '--loaded' : ''];
        }
    },
    created: function () {
        $dispatcher.$on('page:loading', () => {
            console.log('page:loading');
            this.percentage = 0;
            this.active = false;
            this.$nextTick(() => {
                console.log('page:loading next');
                if (this.percentage > 0) {
                    console.log('already loaded?');
                    return;
                }
                this.percentage = 50;
                this.active = true;
            });
        });
        $dispatcher.$on('page:resolving', () => {
            console.log('page:resolving');
            this.percentage = 66;
            this.active = true;
        });
        $dispatcher.$on('page:loaded', () => {
            console.log('page:loaded');
            this.percentage = 100;
            setTimeout(() => {
                this.percentage = 0;
                this.active = false;
            }, 333);
        });
    }
}
</script>
