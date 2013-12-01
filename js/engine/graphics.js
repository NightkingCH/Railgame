/*
* Global graphics object. Provides all functions for drawing onto the canvas.
*/
; (function (global, undefined) {
    var graphics = global.graphics = {
        core: global.core,
        canvas: function () {
            return document.getElementById('game');
        },
        context: function () {
            return graphics.canvas().getContext("2d");
        },
        reset: function () {
            // Store the current transformation matrix
            graphics.context().save();
            
            //Use the identity matrix while clearing the canvas
            graphics.context().setTransform(1, 0, 0, 1, 0, 0);
            graphics.context().clearRect(0, 0, graphics.canvas().width, graphics.canvas().height);
            
            //Restore the transform
            graphics.context().restore();
        },
        beforeDraw: function () {
            graphics.reset();
        },
        /*
        * TODO
        */
        draw: function (drawCallBack) {
            drawCallBack(graphics.context());
        }
    };

    graphics.core.eventAggregator.subscribe(graphics.core.events.beforeDraw, graphics.beforeDraw, 1);
}(this));