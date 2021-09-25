<template>
    <div class="c-dispatcher-notifications">

        <!-- support for multiple positions -->
        <div class="pckg-dispatcher-notifications-wrapper"
             v-for="pos in positions" :class="'--position-' + (pos || 'default')">

            <!-- render alert -->
            <div class="alert alert-dismissible animated" role="alert"
                 :class="alertClass(notification)"
                 v-for="notification in position(pos)">

                <!-- show icon if set -->
                <div class="col" v-if="notification.icon">
                    <i class="fal fa-fw" :class="notification.icon"></i>
                </div>

                <!-- notification content -->
                <div class="col" v-html="notification.content"></div>

                <!-- show confirm or close icon-->
                <div class="col">
                    <a v-if="notification.onConfirm" class="btn btn-primary" data-dismiss="alert"
                       aria-label="Close">
                        <span aria-hidden="true" @click.prevent="confirmNotification(notification)">GOT IT</span>
                    </a>
                    <a v-else href="#" class="close" @click.prevent.stop="removeNotification(notification)">
                        <i class="fal fa-fw fa-times"></i>
                    </a>
                </div>

            </div>
        </div>

        <pckg-loader v-if="loading" class="fixed-center"></pckg-loader>
    </div>
</template>

<style lang="less" scoped>
.pckg-dispatcher-notifications-wrapper {
    position: fixed;
    z-index: 11000;
    bottom: 5rem;
    max-width: 50vw;
    left: 20rem;
    transition: all 333ms ease-in-out;
    body.collapsed & {
        left: 5rem;
    }

    .alert {
        border: none;
        color: #FFF;
        display: table;
        padding: 1.5rem 3rem;
        overflow: hidden;
        margin-bottom: 0;
        margin-top: 2rem;
        .close {
            top: auto;
            right: auto;
        }
    }

    .alert-danger {
        background-color: var(--color-error);
    }

    .alert-success {
        background-color: var(--color-success);
    }

    .alert-info {
        background-color: var(--color-info);
    }

    .col {
        display: table-cell;
        padding: 0 1.5rem;
        vertical-align: middle;
        &:first-child {
            padding: 0;
            width: fit-content;
            text-align: center;
        }
        &:last-child {
            padding: 0;
            width: fit-content;
            text-align: center;
        }
    }

    i {
        font-size: 2rem;
    }

    &.--position-top-center {
        bottom: auto;
        left: 50%;
        top: 0;
        transform: translateX(-50%);

        .btn {
            margin-left: 5rem;
        }
    }
}
</style>

<script>
import {pckgTimeout} from "../../framework/src/Pckg/Framework/public/js/pckg-generic-app-top";

export default {
    name: 'pckg-dispatcher-notifications',
    mixins: [pckgTimeout],
    data: function () {
        return {
            notifications: [],
            positions: [null, 'top-center'],
            loading: false
        };
    },
    methods: {
        removeNotification: function (notification) {
            utils.splice(this.notifications, notification);
        },
        confirmNotification: function (notification) {
            if (notification.onConfirm) {
                notification.onConfirm();
            }
            this.removeNotification(notification);
        },
        alertClass: function (notification) {
            let alertType = 'alert-' + notification.type;
            let animationType = notification.type === 'danger' ? 'shake' : 'fadeInUp';
            return `${alertType} ${animationType}`;
        },
        iconClass: function (notification) {
            return {
                danger: 'fa-exclamation',
                success: 'fa-check',
                warning: 'fa-exclamation',
            }[notification.type] || 'fa-info';
        },
        createNotification: function (msg, type) {
            if (typeof msg === 'object') {
                msg.type = msg.type || type;
                return msg;
            }

            return {
                content: msg,
                type: type,
                icon: this.iconClass({type: type})
            };
        },
        timeoutClose: function (notification) {
            if (notification.onConfirm) {
                return;
            }

            this.timeout('autoclose', function () {
                this.removeNotification(notification);
            }.bind(this), notification.timeout || 5000, notification);
        },
        processMsg: function (msg, type) {
            this.loading = false;
            let notification = this.createNotification(msg, type);
            /**
             * Perform condition check.
             */
            if (notification.condition && !notification.condition()) {
                return;
            }

            /**
             * Perform unique check if necessarry.
             */
            if (notification.unique) {
                let existing = this.notifications.filter(function (existing) {
                    return existing.message === notification.message;
                });
                if (existing.length > 0) {
                    return;
                }
            }
            this.notifications.push(notification);
            this.timeoutClose(notification, type);
        },
        position: function (position) {
            return this.notifications.filter(function (notification) {
                if (!position) {
                    return !notification.position;
                }

                return notification.position === position;
            });
        }
    },
    created: function () {
        $dispatcher.$on('notification:success', function (msg) {
            this.processMsg(msg, 'success');
        }.bind(this));

        $dispatcher.$on('notification:error', function (msg) {
            this.processMsg(msg, 'danger');
        }.bind(this));

        $dispatcher.$on('notification:warning', function (msg) {
            this.processMsg(msg, 'warning');
        }.bind(this));

        $dispatcher.$on('notification:info', function (msg) {
            this.processMsg(msg, 'info');
        }.bind(this));

        $dispatcher.$on('notification:default', function (msg) {
            this.processMsg(msg, 'default');
        }.bind(this));

        $dispatcher.$on('notification:loading', function () {
            this.loading = true;
        }.bind(this));
    }
}
</script>
