$(function()
{
	Backbone.sync = function(method, model, success, error)
	{
		success();
	}

	var Shape = Backbone.Model.extend(
	{
		defaults:
		{
			title:  'shape',
			virgin: true,
			color:	'color(0,0,0,0.75)',
			hexColor: '#000000',
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
			'click .close' : 'close',
			'click .title' : 'toggleSelected',
			'click .hide'  : 'toggleHide',
		},

		initialize: function()
		{
			_.bindAll(this, 'render', 'remove');
			this.model.bind('remove', this.remove);
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
			}
			else
			{
				$this.addClass('selected');
				$this.siblings().removeClass('selected');

				if ($this.hasClass('hidden'))
				{
					$this.removeClass('hidden');
					$(this.el).find('.hide').html('[-]');
				}
			}
		},

		toggleHide: function()
		{
			var $this = $(this.el);

			if ($this.hasClass('hidden'))
			{
				$this.removeClass('hidden');
				$(this.el).find('.hide').html('[-]');
			}
			else
			{
				if ($this.hasClass('selected'))
				{
					$this.removeClass('selected');
				}

				$this.addClass('hidden');
				$(this.el).find('.hide').html('[+]');
			}
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
			_.bindAll(this, 'render', 'remove');
			this.model.bind('remove', this.remove);
		},

		render: function()
		{
			var $shape = $(ShapeView.prototype.render.call(this).el);
			var circle = this.circleTemplate(this.model.toJSON());

			$shape.find('.shapeControls').prepend(circle);
			$(this.el).html($shape.html());

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
			'click #addShape': 'createShape',
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

