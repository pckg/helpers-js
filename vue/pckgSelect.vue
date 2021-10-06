<template>
    <div class="pckg-select" :class="[styleClass, isDisabled ? 'is-disabled' : '']">
        <div class="btn-group">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" @click="focusSearch">
                <i v-if="loading" class="fal fa-spin fa-spinner-third position-absolute"></i>
                <template v-if="hasMultipleSelected">({{ selected.length }})</template>
                {{ selectedTitle }} <i class="__more-icon far fa-chevron-down pull-right"
                                       :class="isDisabled ? 'color-grayish' : ''"></i>
            </a>
            <ul class="dropdown-menu" :style="maxHeightStyle" v-if="!isDisabled">
                <li class="no-hover"
                    v-if="hasSearch && (refreshUrl && refreshUrl.length > 0)">
                    <input type="text" class="form-control input-sm"
                           v-model="search"
                           :placeholder="searchPlaceholder"
                           @keydown.enter="selectFirst"/>
                </li>
                <li class="no-hover"
                    v-else-if="hasFilter && (finalOptions.length > 10 || (filter && filter.length > 0))">
                    <input type="text" class="form-control input-sm"
                           v-model="filter"
                           placeholder="Filter"/>
                </li>
                <li v-if="!isRequired" @click.prevent="toggleOption($event, null)">
                    <a href="#" @click.prevent class="color-grayish">
                        {{ withEmpty }}
                    </a>
                </li>
                <li v-for="option in finalOptions" :key="option.value" @click.prevent="toggleOption($event, option.value)">
                    <a href="#" @click.prevent>
                        <span class="text-left">
                            <i v-if="myMultiple && isValueSelected(option.value)" class="fas fa-fw fa-check-square"></i>
                            <i v-else-if="myMultiple && !isValueSelected(option.value)" class="fal fa-fw fa-square"></i>
                            {{ option.name }}
                            <i v-if="!myMultiple && isValueSelected(option.value)" class="fas fa-fw fa-check"></i>
                        </span>
                    </a>
                </li>
                <template v-for="(optgroup, label) in finalOptionGroups">
                    <li :key="label"><b>{{ label }}</b></li>
                    <li v-for="option in optgroup" :key="label + option.value" @click.prevent="toggleOption($event, option.value)">
                        <a href="#" @click.prevent>
                            <i v-if="myMultiple && isValueSelected(option.value)" class="fas fa-fw fa-check-square"></i>
                            <i v-else-if="myMultiple && !isValueSelected(option.value)" class="fal fa-fw fa-square"></i>
                            {{ option.name }}
                            <i v-if="!myMultiple && isValueSelected(option.value)" class="fas fa-fw fa-check"></i>
                        </a>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        mixins: [pckgTranslations],
        name: 'pckg-select',
        model: {
            prop: 'selected',
        },
        data: function () {
            return {
                myMultiple: this.initialMultiple,
                options: this.initialOptions,
                selectedModel: this.makeModel(this.selected),
                loading: false,
                search: '',
                filter: '',
                myParentValue: this.parentValue,
            };
        },
        props: {
            searchPlaceholder: {
                default: function(){
                    return pckgTranslations.methods.__('common.search');
                },
            },
            hasSearch: {
                default: true
            },
            hasFilter: {
                default: true
            },
            title: {
                default: ''
            },
            id: {
                default: '',
                type: String
            },
            flat: {
                default: false,
                type: Boolean
            },
            withEmpty: '--opened--',
            initialOptions: {
                default: function () {
                    return [];
                }
            },
            selected: {
                default: function () {
                    return [];
                }
            },
            initialMultiple: {
                default: true,
                type: Boolean
            },
            initialRefresh: {
                default: false,
                type: Boolean
            },
            refreshUrl: {
                type: String,
                default: ''
            },
            styleClass: {
                default: '',
                type: String
            },
            name: {
                type: String,
                default: ''
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            isRequired: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            maxHeightStyle: function () {
                return null;
                let myBottom = parseInt($(this.$el).offset().top) - parseInt($(this.$el).outerHeight());
                let bodyBottom = parseInt($('body').outerHeight());
                let h = bodyBottom - myBottom;

                return {'max-height': h + 'px'};
            },
            filteredOptions: function () {
                if (!this.filter || this.filter.length === 0) {
                    return this.options;
                }

                let finalOptions = {};
                $.each(this.options, (i, option) => {
                    if (JSON.stringify(option).toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
                        finalOptions[i] = option;
                    }
                });

                return finalOptions;
            },
            finalOptions: function () {
                return this.extractOptions(this.filteredOptions);
            },
            finalOptionGroups: function () {
                return this.extractOptionGroups(this.filteredOptions);
            },
            selectedTitle: function () {
                let selected = Array.isArray(this.selectedModel) ? this.selectedModel : [this.selectedModel];
                let titles = [];

                let options = this.finalOptions;
                $.each(options, (i, option) => {
                    if (selected.indexOf(option.value) >= 0 || selected.indexOf(parseInt(option.value)) >= 0 || selected.indexOf(option.value.toString()) >= 0) {
                        titles.push(option.name);
                    }
                });

                let groups = this.finalOptionGroups;
                $.each(groups, (i, optionGroup) => {
                    $.each(optionGroup, (j, option) => {
                        if (selected.indexOf(option.value) >= 0 || selected.indexOf(parseInt(option.value)) >= 0 || selected.indexOf(option.value.toString()) >= 0) {
                            titles.push(option.name);
                        }
                    });
                });

                if (titles.length == 0) {
                    return this.withEmpty || this.__('common.select');
                }

                let joined = titles.filter(function(value, index, self){ return self.indexOf(value) === index; }).join(', ');

                if (joined.length > 42) {
                    return joined.substring(0, 42) + '...';
                }

                return joined;
            },
            hasMultipleSelected: function () {
                return this.myMultiple && Array.isArray(this.selected) && this.selected.length > 1;
            }
        },
        watch: {
            search: function () {
                this.refreshList();
            },
            initialOptions: function (newVal) {
                if (Object.keys(newVal) != Object.keys(this.options)) {
                    this.options = this.mergeOptions(newVal);
                }
            },
            selected: function (newVal, oldVal) {
                this.myMultiple = Array.isArray(newVal);
                this.selectedModel = this.makeModel(newVal);
                this.emit();
            },
            initialMultiple: function (newVal, oldVal) {
                this.myMultiple = newVal;
                this.selectedModel = this.makeModel(this.selected);
                this.emit();
            }
        },
        methods: {
            emit: function(){
                this.$emit('change', this.selectedModel);
                this.$emit('input', this.selectedModel);
            },
            focusSearch: function () {
                this.$nextTick(function () {
                    this.dropdownOpened();
                    $(this.$el).find('ul.dropdown-menu > li:first-child input').first().focus();
                }.bind(this));
            },
            isOptionFiltered: function (key, item) {
                if (!this.hasSearch || !this.search || this.search.length == 0) {
                    return false;
                }

                return (typeof item == 'string' && item.toLowerCase().indexOf(this.search.toLowerCase()) < 0 || item == this.search)
                    && (typeof key == 'string' && key.toLowerCase().indexOf(this.search.toLowerCase()) < 0 || item == this.search);
            },
            extractOptions: function (o) {
                var options = [];

                $.each(o, function (key, item) {
                    if (this.flat) {
                        let title = this.getTitle(item, key);
                        let k = this.getId(item, key);
                        if (this.isOptionFiltered(k, title)) {
                            return;
                        }
                        options.push({
                            value: k,
                            name: title
                        });
                        return;
                    }

                    if (typeof item != 'string') {
                        return;
                    }

                    let title = this.getTitle(item, key);
                    let k = this.getId(item, key);

                    if (this.isOptionFiltered(k, title)) {
                        return;
                    }
                    options.push({
                        value: k,
                        name: title
                    });
                }.bind(this));

                return options;
            },
            extractOptionGroups: function (o) {
                if (this.flat) {
                    return {};
                }

                var options = {};
                let isFoundFlat = false;
                $.each(this.filteredOptions, function (key, item) {
                    if (typeof item === 'string' || typeof item === 'number') {
                        return;
                    }

                    if (Array.isArray(item)) {
                        $.each(item, function (subKey, subItem) {
                            var k = this.getId(subItem, subKey);
                            let title = this.getTitle(subItem, subKey)
                            if (this.isOptionFiltered(k, title)) {
                                return;
                            }
                            if (!options[key]) {
                                options[key] = [];
                            }
                            options[key].push({value: k, name: title});
                        }.bind(this));
                        return;
                    }

                    $.each(item, function (k, v) {
                        if (!options[key]) {
                            options[key] = [];
                        }
                        if (typeof v === 'string' && typeof k === 'string') {
                            options[key].push({value: k, name: v});
                            isFoundFlat = true;
                        }
                    });

                    if (isFoundFlat) {
                        return;
                    }

                    if (!item) {
                        return;
                    }
                    let k = this.getId(item, key);
                    let title = this.getTitle(item, key);
                    if (this.isOptionFiltered(k, title)) {
                        return;
                    }
                    if (!options['_']) {
                        options['_'] = [];
                    }
                    options['_'].push({value: k, name: title});
                }.bind(this));

                return options;
            },
            makeModel: function (value) {
                return this.myMultiple
                    ? (Array.isArray(value) ? value : [value])
                    : value;
            },
            extractFlatOptions: function (o) {
                let options = this.extractOptions(o);
                $.each(this.extractOptionGroups(o), function (i, group) {
                    $.each(group, function (j, option) {
                        options.push(option);
                    });
                });
                return options;
            },
            getTitle: function (option, key) {
                if (typeof option == 'string') {
                    return option;
                }

                if (typeof this.title == 'function') {
                    return this.title(option);
                }

                return option[this.title || 'name'];
            },
            getId: function (option, id) {
                if (typeof option != 'object') {
                    return id;
                }

                return option[this.id || 'value'] || id;
            },
            toggleOption: function ($event, key) {
                if (this.initialMultiple) {
                    $event.stopPropagation();
                }

                if (this.initialMultiple && Array.isArray(this.selectedModel)) {
                    let i = this.selectedModel.indexOf(key);
                    if (i >= 0) {
                        this.selectedModel.splice(i, 1);
                        this.emit();
                        return;
                    }

                    this.selectedModel.push(key);
                    this.emit();
                    return;
                }

                this.selectedModel = this.selectedModel == key ? (this.isRequired ? key : null) : key;
                this.emit();
                // close and make normal
                this.dropdownClosed();
            },
            dropdownClosed: function () {
                $(this).closest('--relative-menu-opened').removeClass('--relative-menu-opened');
            },
            dropdownOpened: function () {
                $('.--relative-menu-opened').removeClass('--relative-menu-opened');
                $(this.$el).closest('.s-form-field').addClass('--relative-menu-opened');
            },
            refreshList: function () {
                return;
                this.timeout('refreshList', function () {
                    if (!this.refreshUrl || this.refreshUrl.length < 1) {
                        return;
                    }

                    this.loading = true;
                    http.getJSON(this.refreshUrl + '?search=' + this.search + '&selected=' + (Array.isArray(this.selectedModel) ? this.selectedModel.join(',') : this.selectedModel), function (data) {
                        this.options = data.records;
                        this.loading = false;
                    }.bind(this), function () {
                        this.loading = false;
                    });
                }.bind(this), 333);
            },
            isValueSelected: function (val) {
                if (Array.isArray(this.selectedModel)) {
                    return this.selectedModel.indexOf(val) >= 0;
                }

                return this.selectedModel === val;
            },
            mergeOptions: function (newOptions) {
                let selected = Array.isArray(this.selectedModel) ? this.selectedModel : (this.selectedModel ? [this.selectedModel] : []);

                /**
                 * Find options that are selected but does not exist in collection.
                 */
                let allOptions = this.extractFlatOptions(this.options);
                $.each(selected, function (i, val) {
                    if (!newOptions[val] && allOptions[val]) {
                        newOptions[val] = allOptions[val];
                    }
                });

                return newOptions;
            }
        },
        created: function () {
            /**
             * Initial fetch.
             */
            if (this.initialRefresh) {
                this.refreshList();
            }
        },
        mounted: function () {
            if ((!this.options || this.options.length == 0) && this.refreshUrl && this.refreshUrl.length > 0) {
                // this.refreshList();
            }
        }
    }
</script>
