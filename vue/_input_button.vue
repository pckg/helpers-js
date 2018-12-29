<template>
    <button type="button" class="btn btn-default">
        <i :class="icon" v-if="icon"></i>
        {{ text }}
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
            }
        }
    }
</script>