<template>
    <pckg-modal @close="$emit('no')" size-class="--md" class="--decorate-modal" :class="'--decorate-' + decorate">

        <div class="p-lg">
            <div class="__decoration"></div>
            <div class="flex-grid --gap-lg text-center">

                <div class="m-md">
                    <i class="fas fa-fw fa-2x" :class="['color-' + decorate, 'fa-' + icon]"></i>
                </div>

                <slot></slot>

                <div class="flex-row --jc-space-between">
                    <button @click.prevent="emitState('no')"
                            :disabled="state === 'no'"
                            type="button"
                            class="btn --secondary --text">
                        <i class="fas fa-fw"
                           :class="state !== 'no' ? 'fa-times' : 'fa-spinner fa-spin'"></i>
                        {{ noText }}
                    </button>
                    <button @click.prevent="emitState('yes')"
                            type="button"
                            :disabled="state === 'yes'"
                            class="btn --primary">
                        <i class="fas fa-fw"
                           :class="yesIcon"></i>
                        {{ yesText }}
                    </button>
                </div>

                <div class="color-error bold font-size-xs" v-if="errorMessage">{{ errorMessage }}</div>
            </div>
        </div>

    </pckg-modal>
</template>

<script>
export default {
    props: {
        decorate: {
            type: String,
            default: 'grayish',
            required: false,
        },
        noText: {
            type: String,
            default: 'No',
            required: false
        },
        yesText: {
            type: String,
            default: 'Yes',
            required: false
        },
        icon: {
            type: String,
            default: 'question-circle',
            required: false
        }
    },
    data() {
        return {
            state: null,
            errorMessage: null
        };
    },
    methods: {
        emitState(state) {
            this.state = state;
            this.errorMessage = null;
            if (state === 'no') {
                this.state = state + ':resolved';
            }
            this.$emit(state, {
                resolve: () => {
                    if (state === 'no') {
                        return;
                    }
                    this.state = state + ':resolved';
                },
                reject: (e) => {
                    console.log('rejected', e);
                    let message = 'Something went wrong';
                    if (typeof e === 'string') {
                        message = e;
                    } else if (e instanceof Object && e.responseJSON && e.responseJSON.message) {
                        message = e.responseJSON.message;
                    }
                    this.state = state + ':rejected';
                    this.errorMessage = message;
                }
            });
        }
    },
    computed: {
        yesIcon() {
            if (!this.state) {
                return 'fa-' + this.icon;
            }
            if (this.state === 'yes') {
                return 'fa-spinner fa-spin';
            }
            if (this.state === 'yes:resolved') {
                return 'fa-check';
            }
            if (this.state === 'yes:rejected') {
                return 'fa-times';
            }

            return 'fa-' + this.icon;
        }
    }
}
</script>
