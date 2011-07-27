$(function() {

	var intToHex = function(integer) {

		var hex = integer.toString(16).toUpperCase();

		if (hex.length === 1)
			hex = '0' + hex;

		return hex;
	};

	var Shape = Backbone.Model.extend({

		defaults: {
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

		initialize: function() {

			_.bindAll(this, 'colorChanged');

			this.bind('change:red', this.colorChanged);
			this.bind('change:green', this.colorChanged);
			this.bind('change:blue', this.colorChanged);
		},

		colorChanged: function() {

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
			this.save();
		},
	});

	var Line = Shape.extend({

		defaults: _.extend({}, Shape.prototype.defaults, {
			title:        'line',
			startX:       '',
			startY:       '',
			endX:         '',
			endY:         '',
			editingStart: false,
			editingEnd:   false,
		}),

		isStart: function(x,y) {

			if ((x === this.get('startX')) && (y === this.get('startY')))
				return true;
			else
				return false;
		},

		isEnd: function(x,y) {

			if ((x === this.get('endX')) && (y === this.get('endY')))
				return true;
			else
				return false;
		},
	});

	var Rectangle = Line.extend({

		defaults: _.extend({}, Line.prototype.defaults, {
			title:           'rectangle',
			editingStartEnd: false,
			editingEndStart: false,
		}),

		isStartEnd: function(x,y) {

			if ((x === this.get('startX')) && (y === this.get('endY')))
				return true;
			else
				return false;
		},

		isEndStart: function(x,y) {

			if ((x === this.get('endX')) && (y === this.get('startY')))
				return true;
			else
				return false;
		},
	});

	var Conic = Shape.extend({

		defaults: _.extend({}, Shape.prototype.defaults, {
			title:         'conic',
			centerX:       '',
			centerY:       '',
			editingCenter: false,
		}),

		isCenter: function(x,y) {

			if ((x === this.get('centerX')) && (y === this.get('centerY')))
				return true;
			else
				return false;
		},
	});

	var Circle = Conic.extend({

		defaults: _.extend({}, Conic.prototype.defaults, {
			title:         'circle',
			radius:        '',
			editingRadius: false,
		}),
	});

	var Ellipse = Conic.extend({

		defaults: _.extend({}, Conic.prototype.defaults, {
			title:         'ellipse',
			radiusX:       '',
			radiusY:       '',
			editingRadius: false,
		}),
	});

	var Shapes = Backbone.Collection.extend({

		model: Shape,

		localStorage: new Store('mineConics'),

		fetch: function() {

			Backbone.Collection.prototype.fetch.call(this, {silent: true});

			// convert each Shape to its respective subclass
			this.reset(this.map(function(shape) {

				// ensure no Shapes are 'selected'
				shape.set({selected: false}, {silent: true});

				var type = shape.get('title');

				if (type === 'rectangle')
					return new Rectangle(shape.attributes);
				else if (type === 'line')
					return new Line(shape.attributes);
				else if (type === 'circle')
					return new Circle(shape.attributes);
				else if (type === 'ellipse')
					return new Ellipse(shape.attributes);
			}));
		},
	});

	var ShapeView = Backbone.View.extend({

		tagName: 'li',
		className: 'shape control',

		shapeTemplate: _.template($('#shapeTemplate').html()),

		events: {
			'click .close': 'close',
			'click .title': 'toggleSelected',
			'click .hide':  'toggleHidden',

			'change .color':    'setColor',
			'change .hexColor': 'setHexColor',
		},

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);
		},

		render: function() {

			$(this.el).html(this.shapeTemplate(this.model.toJSON()));

			return this;
		},

		remove: function() {

			var $this = $(this.el);

			$this.slideUp(function() {
				$this.remove();
			});
		},

		close: function() {

			this.model.destroy();
		},

		setSelected: function() {

			var $this = $(this.el);

			$this.addClass('selected');
			$this.find('input').addClass('selected');

			$this.siblings().removeClass('selected');
			$this.siblings().find('input').removeClass('selected');

			if ($this.hasClass('hidden'))
				this.unsetHidden();
		},

		unsetSelected: function() {

			var $this = $(this.el);

			$this.removeClass('selected');
			$this.find('input').removeClass('selected');
		},

		toggleSelected: function() {

			this.model.set({selected: !this.model.get('selected')});
		},

		// set/unset 'selected' based on model state
		changeSelected: function() {

			if (this.model.get('selected'))
				this.setSelected();
			else
				this.unsetSelected();
		},

		setHidden: function() {

			var $this = $(this.el);

			if (this.model.get('selected'))
				this.model.set({selected: false});

			$this.addClass('hidden');
			$this.find('.hide').html('[+]');
			$this.find('.shapeControls').slideUp();
		},

		unsetHidden: function() {

			var $this = $(this.el);
			$this.removeClass('hidden');
			$this.find('.hide').html('[-]');
			$this.find('.shapeControls').slideDown();
		},

		toggleHidden: function() {

			var $this = $(this.el);

			if ($this.hasClass('hidden'))
				this.unsetHidden();
			else
				this.setHidden();
		},

		setColor: function() {

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

		setHexColor: function() {

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

		changeHexInput: function() {

			$(this.el).find('.hexColor').val(this.model.get('hexColor'));
		},
	});

	var LineView = ShapeView.extend({

		lineTemplate: _.template($('#lineTemplate').html()),

		events: _.extend({}, ShapeView.prototype.events, {
			'change .startX': 'updateStartX',
			'change .startY': 'updateStartY',
			'change .endX':   'updateEndX',
			'change .endY':   'updateEndY',
		}),

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeStartX', 'changeStartY', 'changeEndX', 'changeEndY');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:startX', this.changeStartX);
			this.model.bind('change:startY', this.changeStartY);
			this.model.bind('change:endX', this.changeEndX);
			this.model.bind('change:endY', this.changeEndY);
		},

		render: function() {

			var $shape = $(ShapeView.prototype.render.call(this).el);
			var line = this.lineTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(line);
			$(this.el).html($shape.html());

			return this;
		},

		updateStartX: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.startX').val());

			if (!isNaN(testNum)) {

				this.model.set({startX: testNum});
				this.model.save();
			}
			else
				$this.find('.startX').val(this.model.get('startX'));
		},

		updateStartY: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.startY').val());

			if (!isNaN(testNum)) {

				this.model.set({startY: testNum});
				this.model.save();
			}
			else
				$this.find('.startY').val(this.model.get('startY'));
		},

		updateEndX: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.endX').val());

			if (!isNaN(testNum)) {

				this.model.set({endX: testNum});
				this.model.save();
			}
			else
				$this.find('.endX').val(this.model.get('endX'));
		},

		updateEndY: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.endY').val());

			if (!isNaN(testNum)) {

				this.model.set({endY: testNum});
				this.model.save();
			}
			else
				$this.find('.endY').val(this.model.get('endY'));
		},

		changeStartX: function() {

			$(this.el).find('.startX').val(this.model.get('startX'));
		},

		changeStartY: function() {

			$(this.el).find('.startY').val(this.model.get('startY'));
		},

		changeEndX: function() {

			$(this.el).find('.endX').val(this.model.get('endX'));
		},

		changeEndY: function() {

			$(this.el).find('.endY').val(this.model.get('endY'));
		},
	});

	var RectangleView = LineView.extend({

		rectangleTemplate: _.template($('#rectangleTemplate').html()),

		events: _.extend({}, LineView.prototype.events, {
		}),

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeStartX', 'changeStartY', 'changeEndX', 'changeEndY');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:startX', this.changeStartX);
			this.model.bind('change:startY', this.changeStartY);
			this.model.bind('change:endX', this.changeEndX);
			this.model.bind('change:endY', this.changeEndY);
		},

		render: function() {

			var $shape = $(ShapeView.prototype.render.call(this).el);
			var rectangle = this.rectangleTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(rectangle);
			$(this.el).html($shape.html());

			return this;
		},
	});

	var ConicView = ShapeView.extend({

		events: _.extend({}, ShapeView.prototype.events, {
			'change .centerX': 'updateCenterX',
			'change .centerY': 'updateCenterY',
		}),

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeCenterX', 'changeCenterY');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:centerX', this.changeCenterX);
			this.model.bind('change:centerY', this.changeCenterY);
		},

		updateCenterX: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.centerX').val());

			if (!isNaN(testNum)) {

				this.model.set({centerX: testNum});
				this.model.save();
			}
			else
				$this.find('.centerX').val(this.model.get('centerX'));
		},

		updateCenterY: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.centerY').val());

			if (!isNaN(testNum)) {

				this.model.set({centerY: testNum});
				this.model.save();
			}
			else
				$this.find('.centerY').val(this.model.get('centerY'));
		},

		changeCenterX: function() {

			$(this.el).find('.centerX').val(this.model.get('centerX'));
		},

		changeCenterY: function() {

			$(this.el).find('.centerY').val(this.model.get('centerY'));
		},
	});

	var CircleView = ConicView.extend({

		circleTemplate: _.template($('#circleTemplate').html()),

		events: _.extend({}, ConicView.prototype.events, {
			'change .radius':  'updateRadius',
		}),

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeCenterX', 'changeCenterY', 'changeRadius');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:centerX', this.changeCenterX);
			this.model.bind('change:centerY', this.changeCenterY);
			this.model.bind('change:radius', this.changeRadius);
		},

		render: function() {

			var $shape = $(ShapeView.prototype.render.call(this).el);
			var circle = this.circleTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(circle);
			$(this.el).html($shape.html());

			return this;
		},

		updateRadius: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.radius').val());

			if (!isNaN(testNum)) {

				this.model.set({radius: testNum});
				this.model.save();
			}
			else
				$this.find('.radius').val(this.model.get('radius'));
		},

		changeRadius: function() {

			$(this.el).find('.radius').val(this.model.get('radius'));
		},
	});

	var EllipseView = ConicView.extend({

		ellipseTemplate: _.template($('#ellipseTemplate').html()),

		events: _.extend({}, ConicView.prototype.events, {
			'change .radiusX': 'updateRadiusX',
			'change .radiusY': 'updateRadiusY',
		}),

		initialize: function() {

			_.bindAll(this, 'render', 'remove', 'changeHexInput', 'changeSelected', 'changeCenterX', 'changeCenterY', 'changeRadiusX', 'changeRadiusY');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
			this.model.bind('change:selected', this.changeSelected);

			this.model.bind('change:centerX', this.changeCenterX);
			this.model.bind('change:centerY', this.changeCenterY);
			this.model.bind('change:radiusX', this.changeRadiusX);
			this.model.bind('change:radiusY', this.changeRadiusY);
		},

		render: function() {

			var $shape = $(ShapeView.prototype.render.call(this).el);
			var ellipse = this.ellipseTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(ellipse);
			$(this.el).html($shape.html());

			return this;
		},

		updateRadiusX: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.radiusX').val());

			if (!isNaN(testNum)) {

				this.model.set({radiusX: testNum});
				this.model.save();
			}
			else
				$this.find('.radiusX').val(this.model.get('radiusX'));
		},

		updateRadiusY: function() {

			var $this = $(this.el);
			var testNum = parseInt($this.find('.radiusY').val());

			if (!isNaN(testNum)) {

				this.model.set({radiusY: testNum});
				this.model.save();
			}
			else
				$this.find('.radiusY').val(this.model.get('radiusY'));
		},

		changeRadiusX: function() {

			$(this.el).find('.radiusX').val(this.model.get('radiusX'));
		},

		changeRadiusY: function() {

			$(this.el).find('.radiusY').val(this.model.get('radiusY'));
		},
	});

	// repurposing the View object for managing shapes on the canvas
	var ShapeDraw = Backbone.View.extend({});

	var LineDraw = ShapeDraw.extend({

		// Bresenham's line algorithm
		line: function(plot,startX,startY,endX,endY) {

			var steep = false;
			if (Math.abs(endY-startY) > Math.abs(endX-startX))
				steep = true;

			if (steep) {

				var temp = startX;
				startX = startY;
				startY = temp;

				temp = endX;
				endX = endY;
				endY = temp;
			}

			if (startX > endX) {

				var temp = startX;
				startX = endX;
				endX = temp;

				temp = startY;
				startY = endY;
				endY = temp;
			}

			var deltaX = endX - startX;
			var deltaY = Math.abs(endY - startY);
			var error = deltaX / 2;
			var y = startY;

			var yStep;
			if (startY < endY)
				yStep = 1;
			else
				yStep = -1;

			for (var x=startX; x<=endX; x++) {

				if (steep)
					plot(y,x,this.model.get('rgba'));
				else
					plot(x,y,this.model.get('rgba'));

				error -= deltaY;
				if (error < 0) {

					y += yStep;
					error += deltaX;
				}
			}
		},

		render: function(plot) {

			var startX = this.model.get('startX');
			var startY = this.model.get('startY');
			var endX = this.model.get('endX');
			var endY = this.model.get('endY');

			if (!isNaN(parseInt(startX)) && !isNaN(parseInt(startY)) && !isNaN(parseInt(endX)) && !isNaN(parseInt(endY))) {

				this.line(plot,startX,startY,endX,endY);
			}
		},

		setCursor: function(locX,locY) {

			if (this.model.get('virgin'))
				this.canvas.setCursor('crosshair');
			else if (this.model.get('editingStart') || this.model.get('editingEnd'))
				this.canvas.setCursor('closedHand');
			else if (this.model.isStart(locX,locY) || this.model.isEnd(locX,locY))
				this.canvas.setCursor('openHand');
			else
				this.canvas.setCursor('default');
		},

		mouseDown: function(locX, locY) {

			if (this.model.get('virgin')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
				this.model.set({endX: locX});
				this.model.set({endY: locY});

				this.model.set({editingEnd: true});
			}
			else {

				if (this.model.isStart(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingStart: true});
				}
				else if (this.model.isEnd(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingEnd: true});
				}
			}
		},

		mouseMove: function(locX,locY) {

			if (this.model.get('editingStart')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
			}
			else if (this.model.get('editingEnd')) {

				this.model.set({endX: locX});
				this.model.set({endY: locY});
			}
		},

		mouseUp: function(locX,locY) {

			if (this.model.get('editingStart')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
				this.model.set({editingStart: false});
			}
			else if (this.model.get('editingEnd')) {

				this.model.set({endX: locX});
				this.model.set({endY: locY});
				this.model.set({editingEnd: false});
			}

			if (this.model.get('virgin')) {

				this.model.set({virgin: false});
				this.model.set({selected: false});
			}

			this.model.save();
		},
	});

	var RectangleDraw = LineDraw.extend({

		render: function(plot) {

			var startX = this.model.get('startX');
			var startY = this.model.get('startY');
			var endX = this.model.get('endX');
			var endY = this.model.get('endY');

			if (!isNaN(parseInt(startX)) && !isNaN(parseInt(startY)) && !isNaN(parseInt(endX)) && !isNaN(parseInt(endY))) {

				if (startX > endX) {

					var temp = startX;
					startX = endX;
					endX = temp;
				}

				this.line(plot,startX,startY,startX,endY);

				if (startX != endX)
					this.line(plot,endX,startY,endX,endY);

				if (Math.abs(endX - startX) > 1) {

					this.line(plot,startX+1,startY,endX-1,startY);

					if (startY != endY)
						this.line(plot,startX+1,endY,endX-1,endY);
				}
			}
		},

		setCursor: function(locX,locY) {

			if (this.model.get('virgin'))
				this.canvas.setCursor('crosshair');
			else if (this.model.get('editingStart') || this.model.get('editingEnd') || this.model.get('editingStartEnd') || this.model.get('editingEndStart'))
				this.canvas.setCursor('closedHand');
			else if (this.model.isStart(locX,locY) || this.model.isEnd(locX,locY) || this.model.isStartEnd(locX,locY) || this.model.isEndStart(locX,locY))
				this.canvas.setCursor('openHand');
			else
				this.canvas.setCursor('default');
		},

		mouseDown: function(locX, locY) {

			if (this.model.get('virgin')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
				this.model.set({endX: locX});
				this.model.set({endY: locY});

				this.model.set({editingEnd: true});
			}
			else {

				if (this.model.isStart(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingStart: true});
				}
				else if (this.model.isEnd(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingEnd: true});
				}
				else if (this.model.isStartEnd(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingStartEnd: true});
				}
				else if (this.model.isEndStart(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingEndStart: true});
				}
			}
		},

		mouseMove: function(locX,locY) {

			if (this.model.get('editingStart')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
			}
			else if (this.model.get('editingEnd')) {

				this.model.set({endX: locX});
				this.model.set({endY: locY});
			}
			else if (this.model.get('editingStartEnd')) {

				this.model.set({startX: locX});
				this.model.set({endY: locY});
			}
			else if (this.model.get('editingEndStart')) {

				this.model.set({endX: locX});
				this.model.set({startY: locY});
			}
		},

		mouseUp: function(locX,locY) {

			if (this.model.get('editingStart')) {

				this.model.set({startX: locX});
				this.model.set({startY: locY});
				this.model.set({editingStart: false});
			}
			else if (this.model.get('editingEnd')) {

				this.model.set({endX: locX});
				this.model.set({endY: locY});
				this.model.set({editingEnd: false});
			}
			else if (this.model.get('editingStartEnd')) {

				this.model.set({startX: locX});
				this.model.set({endY: locY});
				this.model.set({editingStartEnd: false});
			}
			else if (this.model.get('editingEndStart')) {

				this.model.set({endX: locX});
				this.model.set({startY: locY});
				this.model.set({editingEndStart: false});
			}

			if (this.model.get('virgin')) {

				this.model.set({virgin: false});
				this.model.set({selected: false});
			}

			this.model.save();
		},
	});

	var ConicDraw = ShapeDraw.extend({

		plotFourPoints: function(plot,x,y) {

			plot(this.model.get('centerX')+x,this.model.get('centerY')+y,this.model.get('rgba'));

			if (x != 0)
				plot(this.model.get('centerX')-x,this.model.get('centerY')+y,this.model.get('rgba'));

			if (y != 0)
				plot(this.model.get('centerX')+x,this.model.get('centerY')-y,this.model.get('rgba'));

			if ((x != 0) && (y != 0))
				plot(this.model.get('centerX')-x,this.model.get('centerY')-y,this.model.get('rgba'));
		},

		setCursor: function(locX,locY) {

			if (this.model.get('editingCenter'))
				this.canvas.setCursor('closedHand');
			else if (this.model.isCenter(locX,locY))
				this.canvas.setCursor('openHand');
			else
				this.canvas.setCursor('crosshair');
		},

	});

	var CircleDraw = ConicDraw.extend({

		plotEightPoints: function(plot,x,y) {

			this.plotFourPoints(plot,x,y);

			if (x != y)
				this.plotFourPoints(plot,y,x);
		},

		// midpoint circle algorithm
		render: function(plot) {

			if (!isNaN(parseInt(this.model.get('centerX'))) && !isNaN(parseInt(this.model.get('centerY'))) && !isNaN(parseInt(this.model.get('radius')))) {

				var x = this.model.get('radius');
				var y = 0;
				var error = -x;

				while (x >= y) {

					this.plotEightPoints(plot,x,y);

					error += (2 * y) + 1;
					y++;

					if (error >= 0) {

						x--;
						error -= 2 * x;
					}
				}

				if (this.model.get('selected'))
					plot(this.model.get('centerX'),this.model.get('centerY'));
			}
		},

		mouseDown: function(locX, locY) {

			if (this.model.get('virgin')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({radius: 0});

				this.model.set({editingRadius: true});
			}
			else {

				if (this.model.isCenter(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingCenter: true});
				}
				else {

					this.model.set({editingRadius: true});

					var deltaX = this.model.get('centerX') - locX;
					var deltaY = this.model.get('centerY') - locY;

					this.model.set({radius: (Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)))});
				}
			}
		},

		mouseMove: function(locX,locY) {

			if (this.model.get('editingCenter')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
			}
			else if (this.model.get('editingRadius')) {

				var deltaX = this.model.get('centerX') - locX;
				var deltaY = this.model.get('centerY') - locY;

				this.model.set({radius: parseInt((Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))))});
			}
		},

		mouseUp: function(locX,locY) {

			if (this.model.get('editingCenter')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({editingCenter: false});
			}
			else if (this.model.get('editingRadius')) {

				var deltaX = this.model.get('centerX') - locX;
				var deltaY = this.model.get('centerY') - locY;

				this.model.set({radius: parseInt((Math.sqrt((deltaX*deltaX) + (deltaY*deltaY))))});
				this.model.set({editingRadius: false});
			}

			if (this.model.get('virgin')) {

				this.model.set({virgin: false});
				this.model.set({selected: false});
			}

			this.model.save();
		},
	});

	var EllipseDraw = ConicDraw.extend({

		// midpoint ellipse algorithm
		render: function(plot) {

			if (!isNaN(parseInt(this.model.get('centerX'))) && !isNaN(parseInt(this.model.get('centerY'))) && !isNaN(parseInt(this.model.get('radiusX'))) && !isNaN(parseInt(this.model.get('radiusY')))) {

				var x = -this.model.get('radiusX');
				var y = 0;
				var twoASquare = 2 * (this.model.get('radiusX') * this.model.get('radiusX'));
				var twoBSquare = 2 * (this.model.get('radiusY') * this.model.get('radiusY'));
				var deltaX = (1 - (2 * this.model.get('radiusX'))) * (this.model.get('radiusY') * this.model.get('radiusY'));
				var deltaY = this.model.get('radiusX') * this.model.get('radiusX');
				var error = deltaX + deltaY;
				var errorDoubled;

				do {

					this.plotFourPoints(plot,x,y);

					errorDoubled = 2 * error;

					if (errorDoubled >= deltaX) {

						x++;
						deltaX += twoBSquare;
						error += deltaX;
					}

					if (errorDoubled <= deltaY) {

						y++;
						deltaY += twoASquare;
						error += deltaY;
					}
				} while (x <= 0);

				// for flat ellipses with radiusX = 1
				while (y++ < this.model.get('radiusY')) {

					plot(this.model.get('centerX'), (this.model.get('centerY') + y), this.model.get('rgba')); // draw the tip of the ellipse
					plot(this.model.get('centerX'), (this.model.get('centerY') - y), this.model.get('rgba'));
				}

				if (this.model.get('selected'))
					plot(this.model.get('centerX'), this.model.get('centerY'), this.model.get('rgba'));
			}
		},

		mouseDown: function(locX, locY) {

			if (this.model.get('virgin')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({radiusX: 0});
				this.model.set({radiusY: 0});

				this.model.set({editingRadius: true});
			}
			else {

				if (this.model.isCenter(locX,locY)) {

					this.canvas.setCursor('closedHand');
					this.model.set({editingCenter: true});
				}
				else {

					this.model.set({editingRadius: true});

					var deltaX = Math.abs(this.model.get('centerX') - locX);
					var deltaY = Math.abs(this.model.get('centerY') - locY);

					this.model.set({radiusX: deltaX});
					this.model.set({radiusY: deltaY});
				}
			}
		},

		mouseMove: function(locX,locY) {

			if (this.model.get('editingCenter')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
			}
			else if (this.model.get('editingRadius')) {

				var deltaX = Math.abs(this.model.get('centerX') - locX);
				var deltaY = Math.abs(this.model.get('centerY') - locY);

				this.model.set({radiusX: deltaX});
				this.model.set({radiusY: deltaY});
			}
		},

		mouseUp: function(locX,locY) {

			if (this.model.get('editingCenter')) {

				this.model.set({centerX: locX});
				this.model.set({centerY: locY});
				this.model.set({editingCenter: false});
			}
			else if (this.model.get('editingRadius')) {

				var deltaX = Math.abs(this.model.get('centerX') - locX);
				var deltaY = Math.abs(this.model.get('centerY') - locY);

				this.model.set({radiusX: deltaX});
				this.model.set({radiusY: deltaY});
				this.model.set({editingRadius: false});
			}

			if (this.model.get('virgin')) {

				this.model.set({virgin: false});
				this.model.set({selected: false});
			}

			this.model.save();
		},
	});

	var ShapesPane = Backbone.View.extend({

		el: $('#shapesPane'),

		template: _.template($('#shapesPaneTemplate').html()),

		events: {
			'click #addLine':      'createLine',
			'click #addRectangle': 'createRectangle',
			'click #addCircle':    'createCircle',
			'click #addEllipse':   'createEllipse',
		},

		initialize: function() {

			_.bindAll(this, 'render','addShape', 'addShapes');

			this.collection.bind('add', this.addShape);
			this.collection.bind('reset', this.addShapes);

			this.render();
		},

		resize: function() {

			$('#controlPane').height($(window).height() - $('#header').outerHeight(true) - $('#canvasFooter').outerHeight(true));
			$('#shapesPane').height($('#controlPane').height() - $('#graphPane').height());
			$('#shapes').height($('#shapesPane').height() - $('#addShapes').height());
		},

		render: function() {

			$(this.el).html(this.template({}));
			return this;
		},

		createLine: function() {

			var line = new Line;
			this.collection.create(line);
			line.set({selected: true});
		},

		createRectangle: function() {

			var rectangle = new Rectangle;
			this.collection.create(rectangle);
			rectangle.set({selected: true});
		},

		createCircle: function() {

			var circle = new Circle;
			this.collection.create(circle);
			circle.set({selected: true});
		},

		createEllipse: function() {

			var ellipse = new Ellipse;
			this.collection.create(ellipse);
			ellipse.set({selected: true});
		},

		addShape: function(shape) {

			var view;

			if (shape instanceof Rectangle)
				view = new RectangleView({model: shape});
			else if (shape instanceof Line)
				view = new LineView({model: shape});
			else if (shape instanceof Circle)
				view = new CircleView({model: shape});
			else if (shape instanceof Ellipse)
				view = new EllipseView({model: shape});

			var $newShapeView = $(view.render().el);

			$newShapeView.hide();
			this.$('#shapes').prepend($newShapeView);
			$newShapeView.slideDown();
		},

		addShapes: function() {

			this.collection.each(this.addShape);
		},
	});

	var Graph = Backbone.Model.extend({

		defaults: {
			color:      'rgba(1,1,1,0.1)',
			highlight:  'rgba(1,1,1,0.2)',
			scale:      10,
			originX:    0,
			originY:    0,
			interval:   2,                  // how often a marker is drawn along the axes

			mouseX:     '',                 // location of mouse when within canvas
			mouseY:     '',                 // location of mouse when within canvas
		},

		// essentially +=, but then corrected for floating point errors
		augment: function(delta,options) {

			if (delta.scale) {

				var scaleOrig = this.get('scale');

				var scaleTemp = parseInt((scaleOrig+delta.scale) * 1000) / 1000;

				// make sure 'scale' doesn't get too small nor too big
				if (scaleTemp < 3)
					scaleTemp = 3;
				else if (scaleTemp > 50)
					scaleTemp = 50;

				if (scaleOrig != scaleTemp) {
					//
					// we'll trigger the need to redraw once we're done
					options = _.extend({}, options, {silent: true});

					this.set({scale: scaleTemp}, options);

					if (delta.focusCenter) {

						var canvasCenterX = this.canvas.model.get('width') / 2;
						var canvasCenterY = this.canvas.model.get('height') / 2;

						// zoom to center of canvas
						this.augment({originX: (((canvasCenterX-this.get('originX'))/scaleTemp) * (scaleOrig - scaleTemp))}, options);
						this.augment({originY: (((canvasCenterY-this.get('originY'))/scaleTemp) * (scaleOrig - scaleTemp))}, options);
					}
					else {

						// zoom to the current mouse location
						this.augment({originX: (((this.canvas.model.get('mouseX')-this.get('originX')) / scaleOrig) * (scaleOrig - scaleTemp))}, options);
						this.augment({originY: (((this.canvas.model.get('mouseY')-this.get('originY')) / scaleOrig) * (scaleOrig - scaleTemp))}, options);
					}

					this.trigger('change:scale');
				}
			}

			if (delta.originX) {

				this.set({originX: Math.floor((this.get('originX')*1000) + (delta.originX*1000)) / 1000}, options);
			}

			if (delta.originY) {

				this.set({originY: Math.floor((this.get('originY')*1000) + (delta.originY*1000)) / 1000}, options);
			}
		},

		// return x relative to the graph
		graphX: function(x) {

			return Math.round((x - this.get('originX')) / this.get('scale'));
		},

		// return y relative to the graph
		graphY: function(y) {

			return Math.round((this.get('originY') - y) / this.get('scale'));
		},
	});

	var GraphView = Backbone.View.extend({

		el: $('#graphPane'),

		template: _.template($('#graphControlTemplate').html()),

		events: {
			'click #clear': 'clearShapes',
		},

		initialize: function() {

			_.bindAll(this, 'render', 'clearShapes', 'changeMouseX', 'changeMouseY');

			this.model.bind('change:mouseX', this.changeMouseX);
			this.model.bind('change:mouseY', this.changeMouseY);

			this.render();
			this.$mouseX = $('#mouseX');
			this.$mouseY = $('#mouseY');
		},

		render: function() {

			$(this.el).html(this.template(this.model.toJSON()));
		},

		clearShapes: function() {

			while(this.model.canvas.collection.size())
				this.model.canvas.collection.last().destroy();
		},

		changeMouseX: function() {

			this.$mouseX.html(this.model.get('mouseX'));
		},

		changeMouseY: function() {

			this.$mouseY.html(this.model.get('mouseY'));
		},
	});

	var GraphDraw = Backbone.View.extend({

		initialize: function() {

			_.bindAll(this, 'render', 'plot', 'fill');
		},

		// draw a square on the canvas relative to 'scale'
		fill: function(row,col,color) {

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
		plot: function(x,y,color) {

			var upperLeftX = -parseInt((this.model.get('originX') - (this.model.get('scale')/2)) / this.model.get('scale'));
			var upperLeftY = parseInt((this.model.get('originY') - (this.model.get('scale')/2)) / this.model.get('scale'));

			this.fill(upperLeftY-y,x-upperLeftX,color);
		},

		render: function() {

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

			for (var col=0; col<=cols; col++) {

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

			for (var row=0; row<=rows; row++) {

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

	var Canvas = Backbone.Model.extend({

		defaults: {
			height:     500,                // size of canvas
			width:      500,                // size of canvas
			mouseX:     0,                  // mouse location
			mouseY:     0,                  // mouse location
			lastX:      0,                  // last mouse location
			lastY:      0,                  // last mouse location
			clicking:   false,              // if the user is clicking the mouse button
		},
	});

	var CanvasView = Backbone.View.extend({

		el: $('#canvas'),

		cursors: {
			default:    'default',
			openHand:   'url(images/openhand.cur),move',
			closedHand: 'url(images/closedhand.cur),move',
			crosshair:  'crosshair',
		},

		events: {
			'mousedown':  'mouseDown',
			'mousemove':  'reportLocation',
			'mouseout':   'clearLocation',
			'mousewheel': 'mouseWheel',
		},

		initialize: function() {

			_.bindAll(this, 'render', 'addShape', 'addShapes', 'shapeSelected', 'reportLocation', 'mouseUp', 'mouseMove');

			// in case the user's mouse is not on the canvas
			$(document).bind('mousemove', this.mouseMove);
			$(document).bind('mouseup', this.mouseUp);

			this.model = new Canvas();

			this.$canvas = $(this.el);
			this.context = this.$canvas[0].getContext('2d');

			// set bindings with shapes
			this.collection.bind('add', this.addShape);
			this.collection.bind('reset', this.addShapes);
			this.collection.bind('change:selected', this.shapeSelected);
			this.collection.bind('all', this.render);

			// set up graph
			this.graph = new Graph();
			this.graph.view = new GraphView({model: this.graph});
			this.graph.draw = new GraphDraw({model: this.graph});
			this.graph.canvas = this;
			this.graph.draw.canvas = this;

			this.graph.bind('change:scale', this.render);
			this.graph.bind('change:originX', this.render);
			this.graph.bind('change:originY', this.render);

			this.resize();
			this.graph.set({originX: Math.floor(this.model.get('width') / 2)});
			this.graph.set({originY: Math.floor(this.model.get('height') / 2)});

			this.setCursor('openHand');
		},

		render: function() {
			this.clear();
			this.graph.draw.render();

			this.collection.each(function(shape) {

				shape.draw.render(this.graph.draw.plot);
			},this);
		},

		resize: function() {

			this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#canvasFooter').outerHeight(true)));
			this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#adPane').outerWidth(true)));

			// stash canvas details
			this.model.set({height: this.$canvas.height()});
			this.model.set({width: this.$canvas.width()});

			// adjust size of #canvasPane
			$('#canvasPane').height(this.model.get('height') + $('#canvasFooter').outerHeight(true));
			$('#canvasPane').width(this.model.get('width'));

			// adjust #adPane to align with bottom of canvas
			if ($('#adPane').outerHeight(true) < $(window).height())
			{
				$('#adPane').css('margin-top', $(window).height() - ($('#adPane').height() + $('#canvasFooter').outerHeight(true)));
			}
		},

		addShape: function(shape) {

			var draw;

			if (shape instanceof Rectangle)
				draw = new RectangleDraw({model: shape});
			else if (shape instanceof Line)
				draw = new LineDraw({model: shape});
			else if (shape instanceof Circle)
				draw = new CircleDraw({model: shape});
			else if (shape instanceof Ellipse)
				draw = new EllipseDraw({model: shape});

			draw.canvas = this;
			shape.draw = draw;
		},

		addShapes: function() {

			this.collection.each(this.addShape);
		},

		shapeSelected: function(justSelected) {

			if (justSelected === this.selected) {

				this.selected = null;
				this.setCursor('openHand');
			}
			else {

				if (this.selected)
					this.selected.set({selected: false}, {silent: true});

				this.selected = justSelected;
			}
		},

		reportLocation: function(event) {

			this.graph.set({mouseX: this.graph.graphX(this.canvasX(event.pageX))});
			this.graph.set({mouseY: this.graph.graphY(this.canvasY(event.pageY))});
		},

		clearLocation: function() {

			this.graph.set({mouseX: ''});
			this.graph.set({mouseY: ''});
		},

		mouseDown: function(event) {

			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			this.model.set({clicking: true});

			if (!this.selected)
				this.setCursor('closedHand');
			else {

				var locX = this.graph.graphX(this.model.get('mouseX'));
				var locY = this.graph.graphY(this.model.get('mouseY'));

				this.selected.draw.mouseDown(locX,locY);
			}
		},

		mouseMove: function(event) {

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

			if (!this.selected) {

				this.graph.augment({originX: this.model.get('mouseX') - this.model.get('lastX')});
				this.graph.augment({originY: this.model.get('mouseY') - this.model.get('lastY')});
			}
			else {

				if (this.model.get('mouseX') < 10)
					this.graph.augment({scale: -0.1, focusCenter: true});
				else if (this.model.get('mouseX') > (this.model.get('width') - 10))
					this.graph.augment({scale: -0.1, focusCenter: true});
				else if (this.model.get('mouseY') < 10)
					this.graph.augment({scale: -0.1, focusCenter: true});
				else if (this.model.get('mouseY') > (this.model.get('height') - 10))
					this.graph.augment({scale: -0.1, focusCenter: true});

				this.selected.draw.mouseMove(locX,locY);
			}
		},

		mouseWheel: function(event,delta) {

			this.model.set({lastX: this.model.get('mouseX')});
			this.model.set({lastY: this.model.get('mouseY')});
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			this.graph.augment({scale: delta});
		},

		mouseUp: function(event) {

			this.model.set({lastX: this.model.get('mouseX')});
			this.model.set({lastY: this.model.get('mouseY')});
			this.model.set({mouseX: this.canvasX(event.pageX)});
			this.model.set({mouseY: this.canvasY(event.pageY)});

			if (!this.model.get('clicking'))
				return;

			if (!this.selected) {

				this.graph.augment({originX: this.model.get('mouseX') - this.model.get('lastX')});
				this.graph.augment({originY: this.model.get('mouseY') - this.model.get('lastY')});
			}
			else {

				var locX = this.graph.graphX(this.model.get('mouseX'));
				var locY = this.graph.graphY(this.model.get('mouseY'));

				this.selected.draw.mouseUp(locX,locY);
			}

			this.model.set({clicking: false});
			this.setCursor('openHand');
		},

		setCursor: function(cursor) {

			this.$canvas.css('cursor', this.cursors[cursor]);
		},

		canvasX: function(x) {

			return x - this.$canvas.offset().left;
		},

		canvasY: function(y) {

			return y - this.$canvas.offset().top;
		},

		clear: function() {

			this.context.clearRect(0,0,this.model.get('width'),this.model.get('height'));
		},
	});

	var shapes =     new Shapes();
	var shapesPane = new ShapesPane({collection: shapes});
	var scene =      new CanvasView({collection: shapes});

	shapesPane.resize();
	shapes.fetch();
});

