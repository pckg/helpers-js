<template>
    <table class="table --hover --padding-sm">
        <thead>
        <tr>
            <th></th>
            <th v-if="tableObject.actions.length > 0"></th>
            <template v-for="field in tableObject.fields">
                <th v-if="!field.condition || field.condition()">{{ field.title }}</th>
            </template>
        </tr>
        </thead>
        <tbody class="section-4-hover">
        <tr v-for="record in tableObject.records">
            <td>{{ record.id }}</td>
            <td v-if="tableObject.actions.length > 0"
                class="nobr">
                <pckg-table-actions class="visible@section-hover"
                                    :record="record"
                                    :actions="tableObject.actions"></pckg-table-actions>
            </td>
            <template v-for="field in tableObject.fields">
                <td v-if="!field.condition || field.condition()">{{ getFieldValue(field, record) }}</td>
            </template>
        </tr>
        </tbody>
    </table>
</template>

<script>

import PckgTableActions from './table-actions.vue';

export default {
    components: {
        PckgTableActions,
    },
    props: {
        tableObject: {
            required: true,
        }
    },
    methods: {
        getFieldValue(field, record) {
            if (typeof field.field === 'function') {
                return field.field(record);
            }

            return record[field.field];
        }
    }
}
</script>
