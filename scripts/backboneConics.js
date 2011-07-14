$(function()
{
	Backbone.sync = function(method, model, success, error)
	{
		success();
	}

	var intToHex = function(integer)
	{
		var hex = integer.toString(16).toUpperCase();

		if (hex.length === 1)
			hex = '0' + hex;

		return hex;
	}

	var Shape = Backbone.Model.extend(
	{
		defaults:
		{
			title:    'shape',
			virgin:   true,
			selected: false,
			red:      0,
			green:    0,
			blue:     0,
			alpha:    0.75,
			rgba:     'rgba(0,0,0,0.75)',
			hexColor: '#000000',
		},

		initialize: function()
		{
			_.bindAll(this, 'colorChanged');

			this.bind('change:red', this.colorChanged);
			this.bind('change:green', this.colorChanged);
			this.bind('change:blue', this.colorChanged);
		},

		colorChanged: function()
		{
			var rgba = 'rgba(';
			var hexColor = '#';

			rgba += this.get('red')   + ',';
			rgba += this.get('green') + ',';
			rgba += this.get('blue')  + ',';
			rgba += '0.75)';

			hexColor += intToHex(this.get('red'));
			hexColor += intToHex(this.get('green'));
			hexColor += intToHex(this.get('blue'));

			this.set({rgba: rgba});
			this.set({hexColor: hexColor});
		},
	});

	var Circle = Shape.extend(
	{
		defaults: _.extend({}, Shape.prototype.defaults,
		{
			title:      'circle',
			centerX:    '',
			centerY:    '',
			radius:     '',
		}),

		isCenter: function(x,y)
		{
			if ((x === this.get('centerX')) && (y === this.get('centerY')))
				return true;
			else
				return false;
		},
	});

	var Shapes = Backbone.Collection.extend(
	{
		model: Shape,
	});

	var ShapeView = Backbone.View.extend(
	{
		tagName: 'li',
		className: 'shape control',

		shapeTemplate: _.template($('#shapeTemplate').html()),

		events:
		{
			'click .close': 'close',
			'click .title': 'toggleSelected',
			'click .hide':  'toggleHidden',

			'change .color':    'setColor',
			'change .hexColor': 'setHexColor',
		},

		initialize: function()
		{
			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);
		},

		render: function()
		{
			$(this.el).html(this.shapeTemplate(this.model.toJSON()));

			return this;
		},

		remove: function()
		{
			var $this = $(this.el);

			$this.slideUp(function()
			{
				$this.remove();
			});
		},

		close: function()
		{
			this.model.destroy();
		},

		setSelected: function()
		{
			var $this = $(this.el);

			$this.addClass('selected');
			$this.find('input').addClass('selected');

			$this.siblings().removeClass('selected');
			$this.siblings().find('input').removeClass('selected');

			if ($this.hasClass('hidden'))
				this.unsetHidden();
		},

		unsetSelected: function()
		{
			var $this = $(this.el);

			$this.removeClass('selected');
			$this.find('input').removeClass('selected');
		},

		toggleSelected: function()
		{
			this.model.set({selected: !this.model.get('selected')});
		},

		// set/unset 'selected' based on model state
		changeSelected: function()
		{
			if (this.model.get('selected'))
				this.setSelected();
			else
				this.unsetSelected();
		},

		setHidden: function()
		{
			var $this = $(this.el);

			if (this.model.get('selected'))
				this.model.set({selected: false});

			$this.addClass('hidden');
			$this.find('.hide').html('[+]');
			$this.find('.shapeControls').slideUp();
		},

		unsetHidden: function()
		{
			var $this = $(this.el);
			$this.removeClass('hidden');
			$this.find('.hide').html('[-]');
			$this.find('.shapeControls').slideDown();
		},

		toggleHidden: function()
		{
			var $this = $(this.el);

			if ($this.hasClass('hidden'))
				this.unsetHidden();
			else
				this.setHidden();
		},

		setColor: function()
		{
			var $this = $(this.el);
			var red   = 0;
			var green = 0;
			var blue  = 0;


			if ($this.find('input.red').is(':checked'))
				red = 255;

			if ($this.find('input.green').is(':checked'))
				green = 255;

			if ($this.find('input.blue').is(':checked'))
				blue = 255;

			this.model.set({red: red, green: green, blue: blue});
		},

		setHexColor: function()
		{
			var $this = $(this.el);
			var hexString = $this.find('.hexColor').val();

			if (hexString.charAt(0) == '#')
				hexString = hexString.substring(1,7);

			var red = parseInt(hexString.substring(0,2), 16);
			var green = parseInt(hexString.substring(2,4), 16);
			var blue = parseInt(hexString.substring(4,6), 16);

			// ensure all of the rgb checkboxes are unset
			$this.find('input.color').attr('checked',false);

			if (!isNaN(red) && !isNaN(green) && !isNaN(blue))
				this.model.set({red: red, green: green, blue: blue});
			else
				$this.find('.hexColor').val(this.model.get('hexColor'));
		},

		changeHexInput: function()
		{
			$(this.el).find('.hexColor').val(this.model.get('hexColor'));
		},
	});

	var CircleView = ShapeView.extend(
	{
		circleTemplate: _.template($('#circleTemplate').html()),

		events: _.extend({}, ShapeView.prototype.events,
		{
			'change .centerX': 'updateCenterX',
			'change .centerY': 'updateCenterY',
			'change .radius':  'updateRadius',
		}),

		initialize: function()
		{
			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeCenterX', 'changeCenterY', 'changeRadius');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:centerX', this.changeCenterX);
			this.model.bind('change:centerY', this.changeCenterY);
			this.model.bind('change:radius', this.changeRadius);
		},

		render: function()
		{
			var $shape = $(ShapeView.prototype.render.call(this).el);
			var circle = this.circleTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(circle);
			$(this.el).html($shape.html());

			return this;
		},

		updateCenterX: function()
		{
			var $this = $(this.el);
			var testNum = parseInt($this.find('.centerX').val());

			if (!isNaN(testNum))
				this.model.set({centerX: testNum});
			else
				$this.find('.centerX').val(this.model.get('centerX'));
		},

		updateCenterY: function()
		{
			var $this = $(this.el);
			var testNum = parseInt($this.find('.centerY').val());

			if (!isNaN(testNum))
				this.model.set({centerY: testNum});
			else
				$this.find('.centerY').val(this.model.get('centerY'));
		},

		updateRadius: function()
		{
			var $this = $(this.el);
			var testNum = parseInt($this.find('.radius').val());

			if (!isNaN(testNum))
				this.model.set({radius: testNum});
			else
				$this.find('.radius').val(this.model.get('radius'));
		},

		changeCenterX: function()
		{
			$(this.el).find('.centerX').val(this.model.get('centerX'));
		},

		changeCenterY: function()
		{
			$(this.el).find('.centerY').val(this.model.get('centerY'));
		},

		changeRadius: function()
		{
			$(this.el).find('.radius').val(this.model.get('radius'));
		},
	});

	// repurposing the View object for managing shapes on the canvas
	var ShapeDraw = Backbone.View.extend(
	{
	});

	var CircleDraw = ShapeDraw.extend(
	{
		initialize: function()
		{
		},

		// helper for midpoint circle algorithm
		plotFourPoints: function(plot,x,y)
		{
			plot(this.model.get('centerX')+x,this.model.get('centerY')+y,this.model.get('rgba'));

			if (x != 0)
				plot(this.model.get('centerX')-x,this.model.get('centerY')+y,this.model.get('rgba'));

			if (y != 0)
				plot(this.model.get('centerX')+x,this.model.get('centerY')-y,this.model.get('rgba'));

			if ((x != 0) && (y != 0))
				plot(this.model.get('centerX')-x,this.model.get('centerY')-y,this.model.get('rgba'));
		},

		// helper for midpoint circle algorithm
		plotEightPoints: function(plot,x,y)
		{
			this.plotFourPoints(plot,x,y);

			if (x != y)
				this.plotFourPoints(plot,y,x);
		},

		// midpoint circle algorithm
		render: function(plot)
		{
			if (!isNaN(parseInt(this.model.get('centerX'))) && !isNaN(parseInt(this.model.get('centerY'))) && !isNaN(parseInt(this.model.get('radius'))))
			{
				var x = this.model.get('radius');
				var y = 0;
				var error = -x;

				while (x >= y)
				{
					this.plotEightPoints(plot,x,y);

					error += (2 * y) + 1;
					y++;

					if (error >= 0)
					{
						x--;
						error -= 2 * x;
					}
				}

				if (this.model.get('selected'))
					plot(this.model.get('centerX'),this.model.get('centerY'));
			}
		},

		setCursor: function(locX,locY)
		{
			if (this.model.get('editingCenter'))
				this.canvas.setCursor('closedHand');
			else if (this.model.isCenter(locX,locY))
				this.canvas.setCursor('openHand');
			else
				this.canvas.setCursor('crosshair');
		},

		mouseDown: function(locX, locY)
		{
			if (this.model.get('virgin'))
			{
				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({radius: 0});

				this.model.set({editingRadius: true});
			}
			else
			{
				if (this.model.isCenter(locX,locY))
				{
					this.canvas.setCursor('closedHand');
					this.model.set({editingCenter: true});
				}
				else
				{
					this.model.set({editingRadius: true});

					var deltaX = this.model.get('centerX') - locX;
					var deltaY = this.model.get('centerY') - locY;

					this.model.set({radius: (Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)))});
				}
			}
		},

		mouseMove: function(locX,locY)
		{
			if (this.model.get('editingCenter'))
			{
				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
			}
			else // editing radius
			{
				var deltaX = this.model.get('centerX') - locX;
				var deltaY = this.model.get('centerY') - locY;

				this.model.set({radius: parseInt((Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))))});
			}
		},

		mouseUp: function(locX,locY)
		{
			if (this.model.get('editingCenter'))
			{
				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({editingCenter: false});
			}
			else // editing radius
			{
				var deltaX = this.model.get('centerX') - locX;
				var deltaY = this.model.get('centerY') - locY;

				this.model.set({radius: parseInt((Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))))});
				this.model.set({editingRadius: false});
			}

			if (this.model.get('virgin'))
			{
				this.model.set({virgin: false});
				this.model.set({selected: false});
			}
		},
	});

	var ControlPane = Backbone.View.extend(
	{
		el: $('#controlPane'),

		template: _.template($('#controlPaneTemplate').html()),

		events:
		{
			'click #addShape':  'createShape',
			'click #addCircle': 'createCircle',
		},

		initialize: function()
		{
			_.bindAll(this, 'render','addShape');

			this.collection.bind('add', this.addShape);

			this.render();
		},

		render: function()
		{
			$(this.el).html(this.template({}));
			return this;
		},

		createShape: function()
		{
			var shape = new Shape;
			this.collection.add(shape);
		},

		createCircle: function()
		{
			var circle = new Circle;
			this.collection.add(circle);
			circle.set({selected: true});
		},

		addShape: function(shape)
		{
			var view;

			if (shape instanceof Circle)
				view = new CircleView({model: shape});
			else
				view = new ShapeView({model: shape});

			var $newShapeView = $(view.render().el);

			$newShapeView.hide();
			this.$('#shapes').prepend($newShapeView);
			$newShapeView.slideDown();
		},
	});

	var Graph = Backbone.Model.extend(
	{
		defaults:
		{
			color:      'rgba(1,1,1,0.1)',
			highlight:  'rgba(1,1,1,0.2)',
			scale:      10,
			originX:    0,
			originY:    0,
			interval:   2,                  // how often a marker is drawn along the axes
		},

		// essentially +=, but then corrected for floating point errors
		augment: function(delta,options)
		{
			if (delta.scale)
			{
				var scaleOrig = this.get('scale');

				var scaleTemp = parseInt((scaleOrig+delta.scale) * 1000) / 1000;

				// make sure 'scale' doesn't get too small nor too big
				if (scaleTemp < 3)
					this.set({scale: 3}, options);
				else if (scaleTemp > 50)
					this.set({scale: 50}, options);
				else
				{
					this.set({scale: scaleTemp}, options);

					// zoom to the current mouse location
					this.augment({originX: (((this.canvas.model.get('mouseX')-this.get('originX')) / scaleOrig) * -delta.scale)});
					this.augment({originY: (((this.canvas.model.get('mouseY')-this.get('originY')) / scaleOrig) * -delta.scale)});
				}
			}

			if (delta.originX)
			{
				this.set({originX: Math.floor((this.get('originX')*1000) + (delta.originX*1000)) / 1000}, options);
			}

			if (delta.originY)
			{
				this.set({originY: Math.floor((this.get('originY')*1000) + (delta.originY*1000)) / 1000}, options);
			}
		},

		// return x relative to the graph
		graphX: function(x)
		{
			return Math.round((x - this.get('originX')) / this.get('scale'));
		},

		// return y relative to the graph
		graphY: function(y)
		{
			return Math.round((this.get('originY') - y) / this.get('scale'));
		},
	});

	var GraphView = Backbone.View.extend(
	{
		initialize: function()
		{
			_.bindAll(this, 'render', 'plot', 'fill');
		},

		// draw a square on the canvas relative to 'scale'
		fill: function(row,col,color)
		{
			var width = this.canvas.model.get('width');
			var height = this.canvas.model.get('height');
			var scale = this.model.get('scale');

			var cols = Math.floor(width / scale);
			var rows = Math.floor(height / scale);

			var xOffset = ((this.model.get('originX') - (scale/2)) % scale);
			var yOffset = ((this.model.get('originY') - (scale/2)) % scale);

			this.canvas.context.beginPath();
			this.canvas.context.fillStyle = color;
			this.canvas.context.rect(col*scale+xOffset,row*scale+yOffset,scale-1,scale-1);
			this.canvas.context.closePath();
			this.canvas.context.fill();
		},

		// 'fill' a point on the cartesian plane
		plot: function(x,y,color)
		{
			var upperLeftX = -parseInt((this.model.get('originX') - (this.model.get('scale')/2)) / this.model.get('scale'));
			var upperLeftY = parseInt((this.model.get('originY') - (this.model.get('scale')/2)) / this.model.get('scale'));

			this.fill(upperLeftY-y,x-upperLeftX,color);
		},

		render: function()
		{
			var width = this.canvas.model.get('width');
			var height = this.canvas.model.get('height');
			var scale = this.model.get('scale');

			// fill with background color
			this.canvas.context.beginPath();
			this.canvas.context.fillStyle = this.model.get('color');
			this.canvas.context.rect(0,0,width,height);
			this.canvas.context.closePath();
			this.canvas.context.fill();

			var cols = Math.floor(width / scale);
			var xOffset = ((this.model.get('originX') - (scale/2)) % scale);

			if (xOffset < 0)
				xOffset += scale;

			for (var col=0; col<=cols; col++)
			{
				this.canvas.context.beginPath();
				this.canvas.context.fillStyle = "rgba(255,255,255,1)";
				this.canvas.context.rect((col * scale) + xOffset, 0, 1, height);
				this.canvas.context.closePath();
				this.canvas.context.fill();

				// draw marks along the X axis
				var x = col - parseInt((this.model.get('originX') - (scale/2)) / scale);
				if ((x % this.model.get('interval')) == 0)
					this.plot(x,0,this.model.get('highlight'));
				else if ((col == 0) && (((x-1) % this.model.get('interval')) == 0))
					this.plot(x-1,0,this.model.get('highlight'));
				else if ((col == cols) && (((x+1) % this.model.get('interval')) == 0))
					this.plot(x+1,0,this.model.get('highlight'));
			}

			var rows = Math.floor(height / scale);
			var yOffset = ((this.model.get('originY') - (scale/2)) % scale);

			if (yOffset < 0)
				yOffset += scale;

			for (var row=0; row<=rows; row++)
			{
				this.canvas.context.beginPath();
				this.canvas.context.fillStyle = "rgba(255,255,255,1)";
				this.canvas.context.rect(0, (row * scale) + yOffset, width, 1);
				this.canvas.context.closePath();
				this.canvas.context.fill();

				// draw marks along the Y axis
				var y = parseInt((this.model.get('originY') - (scale/2)) / scale) - row;
				if ((y % this.model.get('interval')) == 0)
					this.plot(0,y,this.model.get('highlight'));
				else if ((row == 0) && (((y+1) % this.model.get('interval')) == 0))
					this.plot(0,y+1,this.model.get('highlight'));
				else if ((row == rows) && (((y-1) % this.model.get('interval')) == 0))
					this.plot(0,y-1,this.model.get('highlight'));
			}
		},
	});

	var Canvas = Backbone.Model.extend(
	{
		defaults:
		{
			height:     500,                // size of canvas
			width:      500,                // size of canvas
			offsetLeft: 0,                  // location of canvas
			offsetTop:  0,                  // location of canvas
			mouseX:     0,                  // mouse location
			mouseY:     0,                  // mouse location
			lastX:      0,                  // last mouse location
			lastY:      0,                  // last mouse location
			clicking:   false,              // if the user is clicking the mouse button
		},
	});

	var CanvasView = Backbone.View.extend(
	{
		el: $('#canvas'),

		cursors:
		{
			default:    'default',
			openHand:   'url(images/openhand.cur),move',
			closedHand: 'url(images/closedhand.cur),move',
			crosshair:  'crosshair',
		},

		events:
		{
			'mousedown':  'mouseDown',
			'mousemove':  'mouseMove',
			'mousewheel': 'mouseWheel',
			'mouseup':    'mouseUp',
			'mouseout':   'mouseUp',
		},

		initialize: function()
		{
			_.bindAll(this, 'render', 'addShape', 'shapeSelected', 'reportLocation');//, 'storeMouseX', 'storeMouseY');

			this.model = new Canvas();
			this.model.bind('change:mouseX', this.reportLocation);
			this.model.bind('change:mouseY', this.reportLocation);

			this.$canvas = $(this.el);
			this.context = this.$canvas[0].getContext('2d');

			// resize the canvas to take advantage of extra viewport space
			this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#zoomHelp').outerHeight(true)));
			this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#adPane').outerWidth(true)));

			// stash canvas details
			this.model.set({height: this.$canvas.height()});
			this.model.set({width: this.$canvas.width()});
			this.model.set({offsetLeft: this.$canvas.offset().left});
			this.model.set({offsetTop: this.$canvas.offset().top});

			// adjust size of #graphPane
			$('#graphPane').height(this.model.get('height'));
			$('#graphPane').width(this.model.get('width'));

			// set bindings with shapes
			this.collection.bind('add', this.addShape);
			this.collection.bind('change:selected', this.shapeSelected);
			this.collection.bind('change', this.render);

			// set up graph
			this.graph = new Graph();
			this.graph.view = new GraphView({model: this.graph});
			this.graph.canvas = this;
			this.graph.view.canvas = this;

			this.graph.bind('change:scale', this.render);
			this.graph.bind('change:originX', this.render);
			this.graph.bind('change:originY', this.render);

			this.graph.set({originX: Math.floor(this.model.get('width') / 2)});
			this.graph.set({originY: Math.floor(this.model.get('height') / 2)});

			this.$location = $('#canvasTest');
			this.setCursor('openHand');
		},

		render: function()
		{
			this.clear();
			this.graph.view.render();

			this.collection.each(function(shape)
			{
				shape.draw.render(this.graph.view.plot);
			},this);
		},


		addShape: function(shape)
		{
			var draw;

			if (shape instanceof Circle)
				draw = new CircleDraw({model: shape});
			else
				draw = new ShapeDraw({model: shape});

			draw.canvas = this;
			shape.draw = draw;
		},

		shapeSelected: function(justSelected)
		{
			if (justSelected === this.selected)
			{
				this.selected = null;
				this.setCursor('openHand');
			}
			else
			{
				if (this.selected)
					this.selected.set({selected: false}, {silent: true});

				this.selected = justSelected;
			}
		},

		reportLocation: function()
		{
			this.$location.text('(' + this.graph.graphX(this.model.get('mouseX')) + ',' + this.graph.graphY(this.model.get('mouseY')) + ')');
		},

		mouseDown: function(event)
		{
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			this.model.set({clicking: true});

			if (!this.selected)
				this.setCursor('closedHand');
			else
			{
				var locX = this.graph.graphX(this.model.get('mouseX'));
				var locY = this.graph.graphY(this.model.get('mouseY'));

				this.selected.draw.mouseDown(locX,locY);
			}
		},

		mouseMove: function(event)
		{
			this.model.set({lastX: this.model.get('mouseX')});
			this.model.set({lastY: this.model.get('mouseY')});
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			var locX = this.graph.graphX(this.model.get('mouseX'));
			var locY = this.graph.graphY(this.model.get('mouseY'));

			if (this.selected)
				this.selected.draw.setCursor(locX,locY);

			if (!this.model.get('clicking'))
				return;

			if (!this.selected)
			{
				this.graph.augment({originX: this.model.get('mouseX') - this.model.get('lastX')});
				this.graph.augment({originY: this.model.get('mouseY') - this.model.get('lastY')});
			}
			else
				this.selected.draw.mouseMove(locX,locY);
		},

		mouseWheel: function(event,delta)
		{
			this.model.set({lastX: this.model.get('mouseX')});
			this.model.set({lastY: this.model.get('mouseY')});
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			this.graph.augment({scale: delta});
		},

		mouseUp: function(event)
		{
			this.model.set({lastX: this.model.get('mouseX')});
			this.model.set({lastY: this.model.get('mouseY')});
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			if (!this.model.get('clicking'))
				return;

			if (!this.selected)
			{
				this.graph.augment({originX: this.model.get('mouseX') - this.model.get('lastX')});
				this.graph.augment({originY: this.model.get('mouseY') - this.model.get('lastY')});
			}
			else
			{
				var locX = this.graph.graphX(this.model.get('mouseX'));
				var locY = this.graph.graphY(this.model.get('mouseY'));

				this.selected.draw.mouseUp(locX,locY);
			}

			this.model.set({clicking: false});
			this.setCursor('openHand');
		},

		setCursor: function(cursor)
		{
			this.$canvas.css('cursor', this.cursors[cursor]);
		},

		canvasX: function(x)
		{
			return x - this.model.get('offsetLeft');
		},

		canvasY: function(y)
		{
			return y - this.model.get('offsetTop');
		},

		clear: function()
		{
			this.context.clearRect(0,0,this.model.get('width'),this.model.get('height'));
		},
	});

	var shapes =      new Shapes();
	var controlPane = new ControlPane({collection: shapes});
	var scene =       new CanvasView({collection: shapes});
});

