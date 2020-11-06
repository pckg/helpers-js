<template>
    <div class="container">
        <div class="display-block">
            <component v-for="heading in headings" :is="heading">Heading</component>
        </div>
        <div class="display-block margin-top-lg">
            <h1>Buttons</h1>

            <div class="display-block margin-bottom-lg" v-for="variation in btnVariations">
                <h2>.--{{ variation }}</h2>
                <div class="display-block u-element-padding">
                    <a href="#" class="btn" v-for="size in sizes" :class="['--' + size, '--' + variation]">This is
                        .btn.--{{ size }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.u-element-padding > &:not(:last-child) {
    margin-right: var(--spacing-md);
}
</style>

<script>
export default {
    data: function () {
        return {
            sizes: ['xxs', 'xs', 'sm', '', 'md', 'lg', 'xl', 'xxl'],
            btnVariations: ['primary', 'secondary', 'bordered --primary', 'bordered --secondary'],
            headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        };
    },
}
</script>