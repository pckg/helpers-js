<template>
    <transition name="modal">
        <div class="modal-mask" :class="maskClass">
            <div class="modal-wrapper" @click.self="$emit('close')">
                <div class="modal-container container --lg">
                    <a href="#"
                       @click.prevent="$emit('close')"
                       class="absolute color-white"
                       style="top: -4.8rem; right: -4.8rem; font-size: 3.6rem;"><ion-icon name="close-circle-outline"></ion-icon></a>
                    <slot></slot>
                    <component v-if="component" :is="component" v-bind="props" class="padding-md"
                               @close="$emit('close')"></component>
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
        }
    }
}
</script>