//custom amplify.
//TODO Extend!
; (function (global, undefined) {

    var slice = [].slice, subscriptions = {};

    var eventAggregator = global.eventAggregator = {
        publish: function (event) {
            if (typeof event !== "string") {
                throw new Error("You must provide a valid event to publish.");
            }

            var args = slice.call(arguments, 1),
                    eventSubscriptions,
                    subscription,
                    length,
                    i = 0,
                    ret;

            if (!subscriptions[event]) {
                return true;
            }

            eventSubscriptions = subscriptions[event].slice();

            for (length = eventSubscriptions.length; i < length; i++) {
                subscription = eventSubscriptions[i];
                ret = subscription.callback.apply(subscription.context, args);
                if (ret === false) {
                    break;
                }
            }
            return ret !== false;
        },

        subscribe: function (event, context, callback, priority) {
            if (typeof event !== "string") {
                throw new Error("You must provide a valid event to create a subscription.");
            }

            if (arguments.length === 3 && typeof callback === "number") {
                priority = callback;
                callback = context;
                context = null;
            }

            if (arguments.length === 2) {
                callback = context;
                context = null;
            }
            priority = priority || 10;

            var eventIndex = 0,
                    events = event.split(/\s/),
                    eventLength = events.length,
                    added;

            for (; eventIndex < eventLength; eventIndex++) {
                event = events[eventIndex];
                added = false;
                if (!subscriptions[event]) {
                    subscriptions[event] = [];
                }

                var i = subscriptions[event].length - 1,
                        subscriptionInfo = {
                            callback: callback,
                            context: context,
                            priority: priority
                        };

                for (; i >= 0; i--) {
                    if (subscriptions[event][i].priority <= priority) {
                        subscriptions[event].splice(i + 1, 0, subscriptionInfo);
                        added = true;
                        break;
                    }
                }

                if (!added) {
                    subscriptions[event].unshift(subscriptionInfo);
                }
            }

            return callback;
        },

        unsubscribe: function (event, context, callback) {
            if (typeof event !== "string") {
                throw new Error("You must provide a valid event to remove a subscription.");
            }

            if (arguments.length === 2) {
                callback = context;
                context = null;
            }

            if (!subscriptions[event]) {
                return;
            }

            var length = subscriptions[event].length,
                    i = 0;

            for (; i < length; i++) {
                if (subscriptions[event][i].callback === callback) {
                    if (!context || subscriptions[event][i].context === context) {
                        subscriptions[event].splice(i, 1);

                        // Adjust counter and length for removed item
                        i--;
                        length--;
                    }
                }
            }
        }
    };

    var events = global.gameEvents = {
        start: "start",
        update: "update",
        beforeDraw: "beforeDraw",
        draw: "draw",
        afterDraw: "afterDraw",
        lateUpdate: "lateUpdate",
        stop: "stop",
		gameObjectRemoved: "gameObjectRemoved",
    };

}(this));