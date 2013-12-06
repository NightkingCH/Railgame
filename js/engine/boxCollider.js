; (function (global, undefined) {

    var colliders = global.colliders.BoxCollider =
        function BoxCollider(args) {
		
			if(!args){
				throw new Error("no parent object found!");
			}
			
			if(!args.parent){
				throw new Error("no parent object found!");
			}

            var self = this;

            this.type = "BoxCollider"; //used to get all objects of the same type
			this.layer = args.parent.layer;
			
            this.core = global.core;
            this.mouse = global.mouse;
            this.graphics = global.graphics;
			this.parent = args.parent;
			
			this.xPos = this.parent.xPos;
			this.yPos = this.parent.yPos;
			this.width = this.parent.width;
			this.height = this.parent.height;
			
			this.isDebug = args.debug ? args.debug : true;

            this.start = function () {
                self.core.eventAggregator.subscribe(self.core.events.update, self.update);
				
				if(self.isDebug){
					self.core.eventAggregator.subscribe(self.core.events.draw, self.draw, 1);
				}
            };

            this.update = function () {
				self.xPos = self.parent.xPos;
				self.yPos = self.parent.yPos;
				self.width = self.parent.width;
				self.height = self.parent.height;
            };
			
			this.draw = function () {
                self.graphics.draw(function (context) {
                    self.drawBoxRectangle(context, self.xPos, self.yPos);
                });
            };

            this.drawBoxRectangle = function (context, xPos, yPos) {
                context.save();

                context.strokeStyle  = "#00FF00";
				context.lineWidth = 1;
				
                context.strokeRect(xPos, yPos, self.width, self.height);

                context.restore();
            };

            this.isStopped = false;

            this.stop = function () {
                self.isStopped = true;

                self.core.eventAggregator.unsubscribe(self.core.events.update, self.update);

                self = null;

                delete self;
            };
        };
}(this));