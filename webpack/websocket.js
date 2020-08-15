
/**
 * Basic implementation for SECURE websocket communication.
 */
import ab from "autobahn";
export class Websocket {

    constructor(hostname, port, args) {
        this.connection = null;
        this.session = null;
        this.onopen = null;
        this.connect(hostname || window.location.hostname, port || 444, args);
    }

    getConnection() {
        return this.connection;
    }

    getSession() {
        return this.session;
    }

    connect(hostname, port, args) {
        this.connection = new ab.Connection({
            url: 'wss://' + hostname + ':' + port,
            realm: 'realm1',
            onchallenge: function (session, method, extra) {
                if (method === "wampcra") {
                    var keyToUse = 'secret1';
                    if (typeof extra.salt !== 'undefined') {
                        keyToUse = ab.auth_cra.derive_key(keyToUse, extra.salt);
                    }

                    return ab.auth_cra.sign(keyToUse, extra.challenge);
                } else {
                    throw "don't know how to authenticate using '" + method + "'";
                }
            },
            authmethods: ['wampcra'],
            authid: 'peter'
        });

        this.connection.onopen = function (session) {
            this.session = session;
            if (this.onopen) {
                this.onopen.call();
            }
        }.bind(this);
    }

    onOpen(callback) {
        this.onopen = callback;
        return this;
    }

    open() {
        this.connection.open();
        return this;
    }

    close() {
        this.connection.close();
        return this;
    }

    subscribe(channel, e, callback) {
        console.log('Subscribing to channel ' + channel + ' with event ' + e);
        this.session.subscribe(channel, function (args) {
            let arg = args[0] || null;
            if (!arg) {
                console.log('no arg', args);
                return;
            }
            arg = JSON.parse(arg);
            let event = arg.event || null;
            if (!event) {
                console.log('NO EVENT', arg);
                return;
            }
            if (e !== event) {
                return;
            }
            /**
             * Call callback.
             */
            console.log('EVENT: ' + e, arg);
            callback(arg.data || null);
        });
    }

    publish(channel, data) {
        console.log('publishing', channel, data);
        this.session.publish(channel, [JSON.stringify(data)]);
    }

    call(channel, params, callback) {
        console.log('calling', channel, params);
        this.session.call(channel, params).then(callback);
    }

    register(channel, callback) {
        console.log('registering', channel);
        this.session.register(channel, callback);
    }

}