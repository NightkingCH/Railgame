; (function (global, undefined) {

    var gameObjects = global.gameObjects.Passenger =
        function Passenger(args) {

            var self = this;

            this.type = "Passenger"; //used to get all objects of the same type

            this.core = global.core;
            this.mouse = global.mouse;
            this.graphics = global.graphics;
			
			this.passaengerSize = { width: Math.round(self.core.getGridsize().width / 2), height: Math.round(self.core.getGridsize().height / 2) };
			
			this.xPos = 0;
            this.yPos = 0;
			
			this.distanceToWalk = 10;
			this.distanceWalked = 0;
			
			this.walkOff = false;

            this.start = function () {
				self.lastUpdate = new Date().getTime()
			
                self.core.eventAggregator.subscribe(self.core.events.update, self.update);
				self.core.eventAggregator.subscribe(self.core.events.draw, self.draw);
            };
			
			this.lastUpdate = null;
			
			this.visibility = 0.2;

            this.update = function () {
                if (self.isStopped)
                    return;
				
				if (!self.walkOff)
                    return;	

				if(self.distanceToWalk <= self.distanceWalked){
					self.walkOff = false;
					self.stop();
					
					return;
				}
				
				var diff = new Date().getTime() - self.lastUpdate;
				
				if(diff >= 50){
					if(self.visibility < 0.9){
						self.visibility += 0.1;
					}
				}
				
				if(diff < 200) //ms
					return;
					
				self.lastUpdate = new Date().getTime();
				
				self.xPos += 10;
							
				self.distanceWalked += 1;	
            };
			
			this.draw = function () {
				if (!self.walkOff)
                    return;	
			
                self.graphics.draw(function (context) {
                    self.drawBoxRectangle(context, self.xPos, self.yPos);
                });
            };

            this.drawBoxRectangle = function (context, xPos, yPos) {
                context.save();
				
				context.fillStyle = "rgba(0, 0, 0, " + self.visibility + ")";

                context.fillRect(xPos, yPos, self.passaengerSize.width, self.passaengerSize.height);

                context.restore();
            };

            this.isStopped = false;

            this.stop = function () {
                self.isStopped = true;

                self.core.eventAggregator.unsubscribe(self.core.events.update, self.update);
                self.core.eventAggregator.unsubscribe(self.core.events.draw, self.draw);

                self = null;

                delete self;
            };
        };
}(this));