//custom amplify.
//TODO Extend!
; (function (global, undefined) {
    var core = global.core = {
        animateFrame: window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null,
        eventAggregator: global.eventAggregator,
        /*
        * All possible events
        */
        events: global.gameEvents,
        exit: false,
        /*
        * Informs all object to init and starts the mainloop
        */
        start: function () {
            core.eventAggregator.publish(core.events.start, core);
            
            core.animateFrame.call(window, core.run);//start recursiv loop
        },
        /*
        * Mainloop
        */
        run: function () {
            
            //exit game, called from stop-function
            if (core.exit) {
                core.eventAggregator.publish(core.events.stop, core);
                return;
            }
            
            core.eventAggregator.publish(core.events.update, core);
            core.eventAggregator.publish(core.events.beforeDraw, core);
            core.eventAggregator.publish(core.events.draw, core);
            core.eventAggregator.publish(core.events.afterDraw, core);
            core.eventAggregator.publish(core.events.lateUpdate, core);
            
            core.animateFrame.call(window, core.run); //recursiv loop
        },
        /*
        * Stops the game
        */
        stop: function () {
            core.exit = true;
        },
    };
}(this));