<template>
    <table class="table --hover --padding-sm">
        <thead>
        <tr>
            <!--<th></th>-->
            <th v-if="tableObject.actions.length > 0"></th>
            <template v-for="field in tableObject.fields">
                <th v-if="!field.condition || field.condition()">{{ field.title }}</th>
            </template>
        </tr>
        </thead>
        <tbody class="section-4-hover">
        <tr v-for="record in tableObject.records">
            <!--<td>{{ record.id }}</td>-->
            <td v-if="tableObject.actions.length > 0"
                class="nobr">
                <pckg-table-actions class="visible@section-hover"
                                    :record="record"
                                    :actions="tableObject.actions"></pckg-table-actions>
            </td>
            <template v-for="field in tableObject.fields">
                <td v-if="!field.condition || field.condition()">
                    <slot :name="`field-${field.field}`"
                          :field="field"
                          :record="record">
                        <div>
                            {{ getFieldValue(field, record) }}
                        </div>
                    </slot>
                    <ul v-if="fieldHasModals(field, record)">
                        <li v-for="(name, key) in getFieldModals(field, record)">
                            <a href="#"
                               class="color-grayish"
                               @click.prevent="tableObject.openModal(key, record)">
                                {{ name }}
                            </a>
                        </li>
                    </ul>
                </td>
            </template>
        </tr>
        </tbody>
    </table>
</template>

<style lang="less" scoped>
table {
    min-width: 100%;
    width: auto;
    max-width: none;
    font-size: 1.4rem;
    color: #111;
}

th {
    white-space: nowrap;
    border-bottom-width: 1px;
    text-transform: uppercase;
    color: #777;
    font-weight: normal;
}
</style>

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
            if (typeof field.value === 'function') {
                return field.value(record);
            }

            return record[field.field];
        },
        handleClick(key, record) {
            const handler = this.tableObject.actions().find(action => action?.key === key);
            handler && handler(record);
        },
        getFieldModals(field, record) {
            let modals = field.modals;

            if (typeof modals === 'function') {
                modals = modals(record);
            }

            if (!modals) {
                return [];
            }

            if (typeof modals === 'object') {
                return Object.keys(modals);
            }

            // should be array
            return modals;
        },
        fieldHasModals(field, record) {
            return this.getFieldModals(field, record).length > 0;
        }
    }
}
</script>
