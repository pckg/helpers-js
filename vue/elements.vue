<template>
    <div class="container --gutter">
        <div class="display-block">
            <component v-for="heading in headings" :is="heading">Heading</component>
        </div>
        <!--<input type="text" class="form-control" v-model="size" />-->
        <input type="text" class="form-control" v-model="roundness" />
        <!--<template v-for="roundness in rounded">-->
            <template v-for="size in sizes">
                <div class="display-block margin-top-lg">
                    <h1>Buttons .--{{ roundness }} .--{{ size }}</h1>

                    <div class="display-block margin-bottom-lg" v-for="variation in btnVariations">
                        <div class="display-block u-element-padding">
                            <a href="#" class="btn"
                               :class="['--' + size, '--' + variation, '--' + roundness]">This is .btn.--{{ size }}.--{{ variation }}</a>
                        </div>
                    </div>
                </div>
                <div class="display-block margin-top-lg">
                    <h1>Forms .--{{ roundness }} .--{{ size }}</h1>

                    <div class="display-block margin-bottom-lg" v-for="variation in formVariations">
                        <div class="display-block u-element-padding">
                            <input f-ro="size in sizes" type="text" class="form-control"
                                   :class="['--' + size, '--' + variation, '--' + roundness]"
                                   :placeholder="['--' + size, '--' + variation, '--' + roundness].join(' ')"/>
                        </div>
                    </div>
                </div>
            </template>
        <!--</template>-->
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
            sizes: ['xxs', 'xs', 'ss', 'sm', 'default', 'md', 'lg', 'xl', 'xxl'],
            btnVariations: ['primary', 'secondary', 'bordered --primary', 'bordered --secondary'],
            formVariations: ['', 'bordered', 'solid'],
            rounded: ['rounded-0', 'rounded-min', 'rounded-xxs', 'rounded-xs', 'rounded-ss', 'default', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-xxl', 'rounded-max'],
            headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            // models
            roundness: 'rounded-max',
            size: 'sm',
        };
    },
}
</script>