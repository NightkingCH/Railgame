; (function (global, undefined) {

    var gameObjects = global.gameObjects.Dotter =
    function Dotter() {

        var self = this;

        this.core = global.core;

        this.graphics = global.graphics;

        this.rectangles = {
            topLeft: [10, 10],
            topRight: [10, 20],
            bottomLeft: [20, 10],
            bottomRight: [20, 20]
        };

        this.xPos = 0;
        this.yPos = 0;

        this.lastUpdate = null;

        this.start = function () {
            self.lastUpdate = new Date().getTime();
			
			self.core.eventAggregator.subscribe(self.core.events.update, self.update);
			self.core.eventAggregator.subscribe(self.core.events.draw, self.draw);
        };

        this.update = function () {
		
			if(self.isStopped)
				return;
		
            var currentTime = new Date().getTime();
            var diff = currentTime - self.lastUpdate;

            if (diff < 1000) {
                return;
            }

            self.lastUpdate = new Date().getTime();

            self.moveDown();
        };

        this.moveDown = function () {
            self.yPos += 10;
        };

        this.moveRight = function () {
            self.xPos += 10;
        };

        this.moveLeft = function () {
            self.xPos -= 10;
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
            context.fillStyle = "#FFBB09";

            context.fillRect(xPos, yPos, 10, 10);

            context.beginPath();
            context.moveTo(xPos, yPos);
            context.lineTo(xPos, yPos + 10);

            context.moveTo(xPos + 10, yPos + 10);
            context.lineTo(xPos, yPos + 10);

            context.moveTo(xPos + 10, yPos);
            context.lineTo(xPos + 10, yPos + 10);

            context.moveTo(xPos, yPos);
            context.lineTo(xPos + 10, yPos);

            context.strokeStyle = "black";
            context.stroke();
            context.restore();
        };

        this.random = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
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