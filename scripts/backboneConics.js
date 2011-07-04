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
			virgin:    true,
			red:       0,
			green:     0,
			blue:      0,
			alpha:     0.75,
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
		},

		updateCenterY: function()
		{
			var $this = $(this.el);
			var testNum = parseInt($this.find('.centerY').val());

			if (!isNaN(testNum))
				this.model.set({centerY: testNum});
		},

		updateRadius: function()
		{
			var $this = $(this.el);
			var testNum = parseInt($this.find('.radius').val());

			if (!isNaN(testNum))
				this.model.set({radius: testNum});
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

			this.shapes = new Shapes;
			this.shapes.bind('add', this.addShape);

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
 			this.shapes.add(shape);
		},

		createCircle: function()
		{
 			var circle = new Circle;
 			this.shapes.add(circle);
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

	var controlPane = new ControlPane;
});

