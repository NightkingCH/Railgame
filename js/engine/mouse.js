; (function (global, undefined) {
    var mouse = global.mouse = {
		core: global.core,
		graphics: global.graphics,
		currentLastMouseClickPosition: { x: 0.0, y: 0.0 },
		currentMousePositon: { x: 0.0, y: 0.0 },
		calcCurrentPosition: function(event){
			var rect = mouse.graphics.canvas().getBoundingClientRect();
			
			currentMousePositon = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		},
		calcLastClickPosition: function(event){
			var rect = mouse.graphics.canvas().getBoundingClientRect();
			
			currentLastMouseClickPositon = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		},
		start: function(){
			$(mouse.graphics.canvas()).on('mousemove', mouse.calcCurrentPosition);
			$(mouse.graphics.canvas()).on('mouseup', mouse.calcLastClickPosition);
		},
    };
	
	mouse.core.eventAggregator.subscribe(mouse.core.events.start, mouse.start);
}(this));