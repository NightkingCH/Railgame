; (function (global, undefined) {

    var gameObjects = global.gameObjects.Station =
    function Station() {

        var self = this;

        this.core = global.core;

        this.mouse = global.mouse;

        this.graphics = global.graphics;

        this.isWaitingOnMouseRelease = false;
        this.isPlaced = false;

        this.rectangles = {
            topLeft:        [this.core.getGridsize().height * 1, this.core.getGridsize().width * 1],
            topMiddle:      [this.core.getGridsize().height * 1, this.core.getGridsize().width * 2],
            topRight:       [this.core.getGridsize().height * 1, this.core.getGridsize().width * 3],
            middleLeft:     [this.core.getGridsize().height * 2, this.core.getGridsize().width * 1],
            middleMiddle:   [this.core.getGridsize().height * 2, this.core.getGridsize().width * 2],
            middleRight:    [this.core.getGridsize().height * 2, this.core.getGridsize().width * 3],
            bottomLeft:     [this.core.getGridsize().height * 3, this.core.getGridsize().width * 1],
            bottomMiddle:   [this.core.getGridsize().height * 3, this.core.getGridsize().width * 2],
            bottomRight:    [this.core.getGridsize().height * 3, this.core.getGridsize().width * 3]
        };

        this.xPos = 0;
        this.yPos = 0;

        this.start = function () {            
            self.core.eventAggregator.subscribe(self.core.events.update, self.update);
            self.core.eventAggregator.subscribe(self.core.events.draw, self.draw);
        };

        this.update = function () {

            if(self.isStopped)
                return;

            if (!self.isPlaced)
                {
                    self.xPos = Math.floor(self.mouse.currentMousePosition.x / self.core.getGridsize().width) * self.core.getGridsize().width;
                    self.yPos = Math.floor(self.mouse.currentMousePosition.y / self.core.getGridsize().height) * self.core.getGridsize().height;
                }

            if (!self.isPlaced)
            {
                if (self.mouse.isMouseDown)
                    {
                        self.isWaitingOnMouseRelease = true;
                        return;
                    }

                if (self.isWaitingOnMouseRelease)
                    {
                        self.isWaitingOnMouseRelease = false;
                        self.xPos = Math.floor(self.mouse.currentLastMouseClickPosition.x / self.core.getGridsize().width) * self.core.getGridsize().width;
                        self.yPos = Math.floor(self.mouse.currentLastMouseClickPosition.y / self.core.getGridsize().height) * self.core.getGridsize().height;
                        self.isPlaced = true;
                    }
            }
        };


        this.draw = function () {
            self.graphics.draw(function (context) {
                for (var prop in self.rectangles) {
                    self.drawBoxRectangle(context, self.rectangles[prop][0] + self.xPos, self.rectangles[prop][1] + self.yPos);
                }
            });
        };

        this.drawBoxRectangle = function (context, xPos, yPos) {
            context.save();
            context.fillStyle = "#FF0000";

            context.fillRect(xPos, yPos, self.core.getGridsize().width, self.core.getGridsize().height);

            context.restore();
        };
        
        this.isStopped = false;
        
        this.stop = function(){
            self.isStopped = true;
            self.core.eventAggregator.unsubscribe(self.core.events.update, self.update);
            self.core.eventAggregator.unsubscribe(self.core.events.draw, self.draw);
                        
            self = null;
            
            delete self;            
        };
    }
}(this));