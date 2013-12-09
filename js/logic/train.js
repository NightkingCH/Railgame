; (function (global, undefined) {

    var gameObjects = global.gameObjects.Train =
        function Train(args) {

            var self = this;

            this.type = "Train"; //used to get all objects of the same type

            this.core = global.core;
            this.mouse = global.mouse;
            this.graphics = global.graphics;

            this.positionsToDriveAlong = args && args.positions;

            this.railRoadCarSize = { width: Math.round(self.core.getGridsize().width / 2), height: self.core.getGridsize().height };
            this.railRoadCarsCount = 1;
            this.railRoadCars = [];

            this.canDrive = true;

            this.start = function () {
                for (var i = 0; i < self.railRoadCarsCount; i++) {
                    self.railRoadCars.push(self.core.getInstanceOf(global.gameObjects.RailRoadCar, { train: self, positions: self.positionsToDriveAlong, railRoadCarPosition: i + 1 }));
                }

                self.core.eventAggregator.subscribe(self.core.events.update, self.update);
            };

            this.update = function () {

                if (self.isStopped)
                    return;

                if (!self.positionsToDriveAlong) {
                    self.core.removeGameObject(self);
                    return;
                }

                self.canDrive = true;

                self.railRoadCars.forEach(function (railRoadCar) {
                    if(railRoadCar.passengerGettingOff) {
                        self.canDrive = false;
                    }
                });
            };

            this.isStopped = false;

            this.stop = function () {
                self.isStopped = true;

                self.core.eventAggregator.unsubscribe(self.core.events.update, self.update);
                self.core.eventAggregator.unsubscribe(self.core.events.draw, self.draw);

                self.railRoadCars.forEach(function(railRoadCar) {
                    self.core.removeGameObject(railRoadCar);
                });

                self = null;

                delete self;
            };
        };
}(this));