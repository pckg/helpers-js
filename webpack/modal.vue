<template>
    <transition name="modal">
        <div class="modal-mask" :class="maskClass">
            <div class="modal-wrapper" @click.self="$emit('close')">
                <div class="modal-container container" :class="sizeClass">
                    <a href="#"
                       @click.prevent="$emit('close')"
                       class="absolute"
                       style="top: 1rem; right: 1rem; font-size: 3.6rem;">
                        <i class="fal fa-times-circle"></i>
                    </a>
                    <div class="modal-overflow">
                        <slot></slot>
                        <component v-if="component" :is="component" v-bind="props" class="padding-md"
                                   @close="$emit('close')"></component>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        component: {
            type: String,
            default: null
        },
        props: {
            default: function () {
                return {};
            }
        },
        size: {
            default: ''
        },
        maskClass: {
            default: null
        },
        sizeClass: {
            default: '--lg',
        }
    }
}
</script>
