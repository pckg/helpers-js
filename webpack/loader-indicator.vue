<template>
    <div class="c-loader-indicator" :class="stateClass" :style="{'--indicator-width': `${percentage}%`}"></div>
</template>

<style lang="less" scoped>
.c-loader-indicator {
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    width: 0;
    height: .333rem;
    background: linear-gradient(to left, var(--color-primary, var(--color-p)), var(--color-secondary, var(--color-s)));
    opacity: 0;
    cursor: progress;
    width: 25%;

    &.--in {
        opacity: 1;
        &.--animated {
            animation: slideright 2s infinite;
        }

        &:not(.--animated) {
            transition: all 333ms ease-in-out;
            width: var(--indicator-width, 30%);
        }
    }

    &.--out {
        opacity: 0;
    }

    &.loaded {
        transition: all 333ms ease-in-out;
    }
}

@keyframes slideright {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(400%);
    }
}
</style>

<script>
export default {
    data: function () {
        return {
            percentage: 0,
            active: false,
            animated: true,
        };
    },
    computed: {
        stateClass: function () {
            return [
                this.active ? '--in --loading' : '--out',
                this.percentage === 100 ? '--loaded' : null,
                this.animated ? '--animated' : null,
            ];
        }
    },
    watch: {
        active(active) {
            $('body')[active ? 'addClass' : 'removeClass']('cursor-wait');
        }
    },
    created: function () {
        $dispatcher.$on('page:loading', () => {
            this.percentage = 0;
            this.active = false;
            this.$nextTick(() => {
                if (this.percentage > 0) {
                    return;
                }
                this.percentage = 50;
                this.active = true;
            });
        });
        $dispatcher.$on('page:resolving', () => {
            this.percentage = 66;
            this.active = true;
        });
        $dispatcher.$on('page:percentage', (percentage) => {
            this.percentage = percentage;
            this.active = percentage > 0 && percentage < 100;
            this.animated = !this.active;
        });
        $dispatcher.$on('page:loaded', () => {
            this.percentage = 100;
            setTimeout(() => {
                this.percentage = 0;
                this.active = false;
                this.animated = true;
            }, 333);
        });
        $dispatcher.$on('page:errored', () => {
            this.percentage = 0;
            this.active = false;
            $dispatcher.$emit('notification:error', 'Error loading page');
        })
    }
}
</script>
