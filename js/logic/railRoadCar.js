; (function (global, undefined) {

    var gameObjects = global.gameObjects.RailRoadCar =
        function RailRoadCar(args) {

            var self = this;

            this.type = "RailRoadCar"; //used to get all objects of the same type
			this.layer = 10; //from 1 to 10, 10 top most!
			this.colliders = [];
            
            this.core = global.core;
            this.mouse = global.mouse;
            this.graphics = global.graphics;
			
			this.parentTrain = args && args.train;
			this.maxRailRoadCars = this.parentTrain.railRoadCarsCount;

            this.positionsToDriveAlongFromTo = args && args.positions;
            this.positionsToDriveAlongToFrom = Array.prototype.slice.call(this.positionsToDriveAlongFromTo).reverse();

            this.positionsToDriveAlong = this.positionsToDriveAlongFromTo;

            this.railRoadCarPosition = args && args.railRoadCarPosition;
			
            this.width = Math.round(self.core.getGridsize().width / 2);
			this.height = self.core.getGridsize().height;
			
            this.xPos = 0;
            this.yPos = 0;

            this.start = function () {
			
                self.colliders.push(self.core.getInstanceOf(global.colliders.BoxCollider, { parent: self }));

                self.core.eventAggregator.subscribe(self.core.events.update, self.update);
                self.core.eventAggregator.subscribe(self.core.events.draw, self.draw, self.layer);
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
					
				var dif = ((self.maxRailRoadCars - self.railRoadCarPosition) * self.core.getGridsize().height);
					
				if (!self.destinationReached && self.xPos == self.destB.x && (self.yPos - dif)  == self.destB.y) {
					self.destinationReached = true;
					
					return;
                }

                //this frame we take our position
                if (self.xPos == self.destB.x && (self.yPos - dif) == self.destB.y) {
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
						
						return;
                    }

                    if (self.yPos != self.destB.y) {
                        self.yPos += self.core.getGridsize().height;
						
						return;
                    }
                }

                if (!self.switch) {
                    if (self.xPos != self.destB.x) {
                        self.xPos -= self.core.getGridsize().width;
						
						return;
                    }

                    if (self.yPos != self.destB.y) {
                        self.yPos -= self.core.getGridsize().height;
						
						return;
                    }
                }				
            };

            this.draw = function () {
                self.graphics.draw(function (context) {
                    self.drawBoxRectangle(context, self.xPos, self.yPos + (self.core.getGridsize().height * (self.railRoadCarPosition - 1)));
                });
            };

            this.drawBoxRectangle = function (context, xPos, yPos) {
                context.save();

				context.fillStyle = "#000000";

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