<template>

    <!-- translation dropdown -->
    <div class="c-pckg-locale-dropdown dropdown display-inline">
        <a class="dropdown-toggle not-link btn-xs" type="button"
           data-toggle="dropdown">
            <span class="caret"></span>
            {{ value }}
        </a>
        <ul class="dropdown-menu" role="menu">
            <li role="presentation" v-for="language in languages">
                <a role="menuitem" tabindex="-1" href="#"
                   @click.prevent="selectLocale(language.locale)">{{ language.title }}</a>
            </li>
        </ul>
    </div>

</template>

<script>
export default {
    methods: {
        selectLocale: function (value) {
            this.$store.commit('setCurrentLanguage', value);
        }
    },
    computed: {
        languages: function () {
            return Pckg.config.locale.languages || {};
        },
        value: function () {
            return this.$store.state.config.config.locale.current;
        }
    }
}
</script>