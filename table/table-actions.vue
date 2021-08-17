<template>
    <div class="c-table-actions nobr">
        <template v-for="action in activeActions">
            <router-link v-if="action.href"
                         class="action-link"
                         :title="action.title"
                         :to="action.href(record) || '#'">
                <i class="fal fa-fw" :class="'fa-' + action.icon"></i>
            </router-link>
            <a v-else-if="action.handler"
               class="action-link"
               href="#"
               :title="action.title"
               :alt="action.title"
               @click.prevent="action.handler(record)">
                <i class="fal fa-fw" :class="'fa-' + action.icon"
                   :alt="action.title"></i>
            </a>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        record: {
            type: Object,
            required: true,
        },
        actions: {
            type: Array,
            required: true,
        }
    },
    computed: {
        activeActions() {
            return this.actions.filter((action) => {
                return !action.condition || action.condition(this.record);
            })
        }
    }
}
</script>
