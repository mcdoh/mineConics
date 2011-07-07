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
			title:   'circle',
			centerX: '',
			centerY: '',
			radius:  '',
		}),
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
			'click .hide':  'toggleHide',

			'change .color':    'setColor',
			'change .hexColor': 'setHexColor',
		},

		initialize: function()
		{
			_.bindAll(this, 'render', 'remove', 'changeHexInput');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
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

		toggleSelected: function()
		{
			var $this = $(this.el);

			if ($this.hasClass('selected'))
			{
				$this.removeClass('selected');
				$this.find('input').removeClass('selected');
			}
			else
			{
				$this.addClass('selected');
				$this.find('input').addClass('selected');

				$this.siblings().removeClass('selected');
				$this.siblings().find('input').removeClass('selected');

				if ($this.hasClass('hidden'))
				{
					$this.removeClass('hidden');
					$this.find('.hide').html('[-]');
					$this.find('.shapeControls').slideDown();
				}
			}
		},

		toggleHide: function()
		{
			var $this = $(this.el);

			if ($this.hasClass('hidden'))
			{
				$this.removeClass('hidden');
				$this.find('.hide').html('[-]');
				$this.find('.shapeControls').slideDown();
			}
			else
			{
				if ($this.hasClass('selected'))
				{
					$this.removeClass('selected');
					$this.find('input').removeClass('selected');
				}

				$this.addClass('hidden');
				$this.find('.hide').html('[+]');
				$this.find('.shapeControls').slideUp();
			}
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
			_.bindAll(this, 'render', 'remove', 'changeHexInput');

			this.model.bind('remove', this.remove);
			this.model.bind('change:hexColor', this.changeHexInput);
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
			interval:   2,                        // how often a marker is drawn along the axes
		},

		// essentially +=, but then corrected for floating point errors
		augment: function(delta)
		{
			if (delta.scale)
			{
				var scaleOrig = this.get('scale');
				var scaleTemp = scaleOrig;

				scaleTemp = parseInt((scaleTemp*1000) + (delta.scale*1000)) / 1000;

				// make sure 'scale' doesn't get too small nor too big
				if (scaleTemp < 3)
					this.set({scale: 3});
				else if (scaleTemp > 50)
					this.set({scale: 50});
				else
					this.set({scale: scaleTemp});
			}

			if (delta.originX)
			{
				this.set({originX: Math.floor((this.get('originX')*1000) + (delta.originX*1000)) / 1000});
			}

			if (delta.originY)
			{
				this.set({originY: Math.floor((this.get('originY')*1000) + (delta.originY*1000)) / 1000});
			}
		},

		// return x relative to the graph
		getX: function(x)
		{
			return Math.round((x - this.get('originX')) / this.get('scale'));
		},

		// return y relative to the graph
		getY: function(y)
		{
			return Math.round((this.get('originY') - y) / this.get('scale'));
		},

		// draw a square on the canvas relative to 'scale'
		fill: function(row,col,color)
		{
			var width = this.view.width;
			var height = this.view.height;
			var scale = this.get('scale');

			var cols = Math.floor(width / scale);
			var rows = Math.floor(height / scale);

			var xOffset = ((this.get('originX') - (scale/2)) % scale);
			var yOffset = ((this.get('originY') - (scale/2)) % scale);

			this.view.context.beginPath();
			this.view.context.fillStyle = color;
			this.view.context.rect(col*scale+xOffset,row*scale+yOffset,scale-1,scale-1);
			this.view.context.closePath();
			this.view.context.fill();
		},

		// 'fill' a point on the cartesian plane
		plot: function(x,y,color)
		{
			var upperLeftX = -parseInt((this.get('originX') - (this.get('scale')/2)) / this.get('scale'));
			var upperLeftY = parseInt((this.get('originY') - (this.get('scale')/2)) / this.get('scale'));

			this.fill(upperLeftY-y,x-upperLeftX,color);
		},

		drawGraph: function()
		{
			var width = this.view.width;
			var height = this.view.height;
			var scale = this.get('scale');

			// fill with background color
			this.view.context.beginPath();
			this.view.context.fillStyle = this.get('color');
			this.view.context.rect(0,0,width,height);
			this.view.context.closePath();
			this.view.context.fill();

			var cols = Math.floor(width / scale);
			var xOffset = ((this.get('originX') - (scale/2)) % scale);

			for (var col=0; col<=cols; col++)
			{
				this.view.context.beginPath();
				this.view.context.fillStyle = "rgba(255,255,255,1)";
				this.view.context.rect((col * scale) + xOffset, 0, 1, height);
				this.view.context.closePath();
				this.view.context.fill();

				// draw marks along the X axis
				var x = col - parseInt((this.get('originX') + (scale/2)) / scale);
				if ((x % this.get('interval')) == 0)
					this.plot(x,0,this.get('highlight'));
				else if ((col == cols) && (((x+1) % this.get('interval')) == 0))
					this.plot(x+1,0,this.get('highlight')); // slight hack for small slivers at the edge
			}

			var rows = Math.floor(height / scale);
			var yOffset = ((this.get('originY') - (scale/2)) % scale);

			for (var row=0; row<=rows; row++)
			{
				this.view.context.beginPath();
				this.view.context.fillStyle = "rgba(255,255,255,1)";
				this.view.context.rect(0, (row * scale) + yOffset, width, 1);
				this.view.context.closePath();
				this.view.context.fill();

				// draw marks along the Y axis
				var y = parseInt((this.get('originY') - (scale/2)) / scale) - row;
				if ((y % this.get('interval')) == 0)
					this.plot(0,y,this.get('highlight'));
				else if ((row == 0) && (((y+1) % this.get('interval')) == 0))
					this.plot(0,y+1,this.get('highlight')); // slight hack for small slivers at the edge
			}
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
//			'mousewheel': 'mouseMove',
			'mouseup':    'mouseUp',
			'mouseout':   'mouseOut',
		},

		initialize: function()
		{
			_.bindAll(this, 'drawScene');

			this.$canvas = $(this.el);
			this.context = this.$canvas[0].getContext('2d');

			this.startX;           // the last X location processed while 'clicking'
			this.startY;           // the last Y location processed while 'clicking'
			this.clicking = false; // whether or not the user is currently clicking

			// resize the canvas to take advantage of extra viewport space
			this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#zoomHelp').outerHeight(true)));
			this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#adPane').outerWidth(true)));

			this.height = this.$canvas.height();
			this.width = this.$canvas.width();

			$('#graphPane').height(this.height);
			$('#graphPane').width(this.width);

			this.model = new Graph();
			this.model.view = this;

			this.model.bind('change', this.drawScene);
			this.model.set({originX: Math.floor(this.width / 2)});
			this.model.set({originY: Math.floor(this.height / 2)});

			this.setCursor('openHand');
		},

		clear: function()
		{
			this.context.clearRect(0,0,this.width,this.height);
		},

		drawScene: function()
		{
			this.clear();
			this.model.drawGraph();
		},

		mouseDown: function(event)
		{
			var curX = this.getX(event.pageX);
			var curY = this.getY(event.pageY);
			$('#canvasTest').text('mousemove: '+curX+','+curY);

			this.startX = curX;
			this.startY = curY;

			this.clicking = true;
			this.setCursor('closedHand');
		},

		mouseMove: function(event)
		{
			var curX = this.getX(event.pageX);
			var curY = this.getY(event.pageY);
			$('#canvasTest').text('mousemove: '+curX+','+curY);

			if (!this.clicking)
				return;

			this.model.augment({originX: curX - this.startX});
			this.model.augment({originY: curY - this.startY});

			this.startX = curX;
			this.startY = curY;
		},

// 		mouseWheel: function(event,delta)
// 		{
// 			var curX = this.getX(event.pageX);
// 			var curY = this.getY(event.pageY);
// 			$('#canvasTest').text('mousewheel: '+curX+','+curY);
// 
// 			var mouseX = curX - this.model.get('originX');
// 			var mouseY = curY - this.model.get('originY');
// 
// 			this.model.originX(-(mouseX / this.model.get('scale')) * delta);
// 			this.model.originY(-(mouseY / this.model.get('scale')) * delta);
// 		},

		mouseUp: function(event)
		{
			var curX = this.getX(event.pageX);
			var curY = this.getY(event.pageY);
			$('#canvasTest').text('mouseup: '+curX+','+curY);

			if (!this.clicking)
				return;

			this.model.augment({originX: curX - this.startX});
			this.model.augment({originY: curY - this.startY});

			this.startX = curX;
			this.startY = curY;

			this.clicking = false;
			this.setCursor('openHand');
		},

		mouseOut: function(event)
		{
			var curX = this.getX(event.pageX);
			var curY = this.getY(event.pageY);
			$('#canvasTest').text('mouseup: '+curX+','+curY);

			if (!this.clicking)
				return;

			this.model.augment({originX: curX - this.startX});
			this.model.augment({originY: curY - this.startY});

			this.startX = curX;
			this.startY = curY;

			this.clicking = false;
			this.setCursor('openHand');
		},

		setCursor: function(cursor)
		{
			this.$canvas.css('cursor', this.cursors[cursor]);
		},

		offsetLeft: function()
		{
			return this.$canvas.offset().left;
		},

		offsetTop: function()
		{
			return this.$canvas.offset().top;
		},

		getX: function(x)
		{
			return x - this.offsetLeft();
		},

		getY: function(y)
		{
			return y - this.offsetTop();
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

	var shapes =      new Shapes();
	var controlPane = new ControlPane({collection: shapes});
	var canvas =      new CanvasView();
});

