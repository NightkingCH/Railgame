; (function (global, undefined) {
    var gameObjects = global.gameObjects = {};
    
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
        startTime: null,
        frameStartTime: null,
        currentTime: function () {
            return new Date().getTime();
        },
        deltaTime: null,
        calcDeltaTime: function () {
            return core.currentTime() - core.startTime;
        },
        deltaDelay: 0,
        maxFramesPerSecond: 60,
        /*
        * Informs all object to init and starts the mainloop
        */
        start: function (options) {
            core.startTime = new Date().getTime();
            core.frameStartTime = core.startTime;

            core.deltaDelay = (options && options.deltaDelay) || 1000.0 / core.maxFramesPerSecond;
            
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
            
            core.deltaTime = core.calcDeltaTime();
            
            if (core.deltaTime < core.deltaDelay){
                core.animateFrame.call(window, core.run); //recursiv loop

                return;
            }
            
            core.startTime = core.currentTime();
            
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