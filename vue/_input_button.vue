<template>
    <button :type="type" class="btn btn-default">
        <i :class="icon" v-if="icon"></i>
        {{ text }}<slot></slot>
        <pckg-loader v-if="loading" :loading="loading"></pckg-loader>
    </button>
</template>

<script>
    export default {
        name: 'd-input-button',
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            text: {
                type: String
            },
            icon: {
                default: null
            },
            type: {
                default: 'button'
            }
        }
    }
</script>