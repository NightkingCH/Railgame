; (function (global, undefined) {

    var gameObjects = global.gameObjects.RailRoadCar =
        function RailRoadCar(args) {

            var self = this;

            this.type = "RailRoadCar"; //used to get all objects of the same type

            this.parentTrain = args && args.train;
            this.core = global.core;
            this.mouse = global.mouse;
            this.graphics = global.graphics;

            this.positionsToDriveAlongFromTo = args && args.positions;
            this.positionsToDriveAlongToFrom = Array.prototype.slice.call(this.positionsToDriveAlongFromTo).reverse();

            this.positionsToDriveAlong = this.positionsToDriveAlongFromTo;

            this.railRoadCarPosition = args && args.railRoadCarPosition;
            this.railRoadCarSize = { width: Math.round(self.core.getGridsize().width / 2), height: self.core.getGridsize().height };

            this.xPos = 0;
            this.yPos = 0;

            this.start = function () {
                self.core.eventAggregator.subscribe(self.core.events.update, self.update);
                self.core.eventAggregator.subscribe(self.core.events.draw, self.draw);
            };

            this.lastDestIndex = 0;
            this.destinationReached = false;

            this.destA = { x: 0.0, y: 0.0 };
            this.destB = { x: 0.0, y: 0.0 };

            this.switch = true;
            this.passengerGettingOff = false;
            this.passengerInit = false;
            
            this.passengers = [];
			this.lastUpdate = null;

            this.update = function () {

                if (self.isStopped)
                    return;

                if (!self.positionsToDriveAlong) {
                    self.core.removeGameObject(self);
                    return;
                }

                //simple movement from a to b
                if (self.destinationReached && !self.passengerGettingOff && !self.passengerInit) {
                    self.positionsToDriveAlong = self.switch ? self.positionsToDriveAlongToFrom : self.positionsToDriveAlongFromTo;

                    self.switch = !self.switch;
                    self.lastDestIndex = 0;

                    var rndPassengers = global.utils.getRandomInt(10, 20);

                    for (var k = 0; k < rndPassengers; k++) {
                        self.passengers.push(self.core.getInstanceOf(global.gameObjects.Passenger));
                    }

                    self.passengerGettingOff = true;
                    self.passengerInit = true;
					self.lastUpdate = new Date().getTime();
                }

                if (self.passengerGettingOff) {
                    if (self.passengers.length <= 0) {
                        self.passengerGettingOff = false;
						
						return;
                    }
					
					var diff = new Date().getTime() - self.lastUpdate;
					
					if(diff < 100){
						return;
					}

                    if (self.passengers.length > 0) {
                        var rndPassengersToRemove = global.utils.getRandomInt(0, self.passengers.length);

                        for (var j = 0; j < rndPassengersToRemove; j++) {
                            var passenger = self.passengers.splice(0, 1)[0];
							
							passenger.xPos = self.xPos;
							passenger.yPos = self.yPos + (self.core.getGridsize().height * self.railRoadCarPosition);
							
							passenger.walkOff = true;
                        }
						
						self.lastUpdate = new Date().getTime();

                        return;
                    }
                }

                if (!self.parentTrain.canDrive)
                    return;

                //this frame we take our position
                if (self.xPos == self.destB.x && self.yPos == self.destB.y) {
                    //grab first two destinations
                    self.destA = self.positionsToDriveAlong[self.lastDestIndex];
                    self.destB = self.positionsToDriveAlong[self.lastDestIndex + 1];
                    self.lastDestIndex = self.lastDestIndex + 1;

                    self.xPos = self.destA.x;
                    self.yPos = self.destA.y;

                    self.destinationReached = false;
                    self.passengerInit = false;

                    //next frame we start driving
                    return;
                }

                if (self.switch) {
                    if (self.xPos != self.destB.x) {
                        self.xPos += self.core.getGridsize().width;
                    }

                    if (self.yPos != self.destB.y) {
                        self.yPos += self.core.getGridsize().height;
                    }
                }

                if (!self.switch) {
                    if (self.xPos != self.destB.x) {
                        self.xPos -= self.core.getGridsize().width;
                    }

                    if (self.yPos != self.destB.y) {
                        self.yPos -= self.core.getGridsize().height;
                    }
                }

                if (self.xPos == self.destB.x && self.yPos == self.destB.y) {
                    self.destinationReached = true;
                }

            };

            this.draw = function () {
                self.graphics.draw(function (context) {
                    self.drawBoxRectangle(context, self.xPos, self.yPos + (self.core.getGridsize().height * self.railRoadCarPosition));
                });
            };

            this.drawBoxRectangle = function (context, xPos, yPos) {
                context.save();

                if (self.railRoadCarPosition === 1) {
                    context.fillStyle = "#FF0000";
                }
                if (self.railRoadCarPosition === 2) {
                    context.fillStyle = "#00FF00";
                }
                if (self.railRoadCarPosition === 3) {
                    context.fillStyle = "#0000FF";
                }
                // context.fillStyle = "#000000";

                context.fillRect(xPos, yPos, self.parentTrain.railRoadCarSize.width, self.parentTrain.railRoadCarSize.height);

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