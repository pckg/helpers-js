<template>
    <pckg-modal-actionable decorate="error"
                           no-text="No, cancel"
                           yes-text="Yes, delete"
                           icon="trash"
                           @yes="$emit('yes', $event)"
                           @no="$emit('no', $event)">
        <slot></slot>
    </pckg-modal-actionable>
</template>

<script>
export default {}
</script>
