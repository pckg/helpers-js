<template>

    <!-- translation dropdown -->
    <div class="dropdown display-inline">
        <a class="dropdown-toggle not-link btn-xs" type="button"
           data-toggle="dropdown">
            <span class="caret"></span>
            {{ value }}
        </a>
        <ul class="dropdown-menu" role="menu">
            <li role="presentation">
                <a role="menuitem" tabindex="-1" href="#" @click.prevent="selectLocale('en_gb')">EN</a>
            </li>
            <li role="presentation">
                <a role="menuitem" tabindex="-1" href="#" @click.prevent="selectLocale('hr_hr')">HR</a>
            </li>
            <li role="presentation">
                <a role="menuitem" tabindex="-1" href="#" @click.prevent="selectLocale('sl_si')">SI</a>
            </li>
        </ul>
    </div>

</template>

<script>
    export default {
        props: {
            value: {}
        },
        model: {
            prop: 'value'
        },
        methods: {
            selectLocale: function (value) {
                this.$emit('input', value);
            }
        }
    }
</script>