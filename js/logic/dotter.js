//custom amplify.
//TODO Extend!
; (function (global, undefined) {
    var dotter = global.dotter = {
        core: global.core,
        graphics: global.graphics,
        xPos: 0,
        yPos: 0,
        update: function () {
            dotter.xPos = dotter.random(0, 100);
            dotter.yPos = dotter.random(0, 100);
        },
        draw: function () {
            dotter.graphics.draw(function (context) {
                context.save();
                context.fillStyle = "black";
                context.fillRect(dotter.xPos, dotter.yPos, 4, 4);
                context.restore();
            });
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    dotter.core.eventAggregator.subscribe(dotter.core.events.update, dotter.update);
    dotter.core.eventAggregator.subscribe(dotter.core.events.draw, dotter.draw);
}(this));