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
			virgin: true,
			color: "color(0,0,0,0.75)",
		},
	});

	var Shapes = Backbone.Collection.extend(
	{
		model: Shape,
	});

	var ShapeView = Backbone.View.extend(
	{
		tagName: 'li',

		template: _.template($('#shapeTemplate').html()),

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
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},

		remove: function()
		{
			$this = $(this.el);

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
			$this = $(this.el);

			if ($this.hasClass('selected'))
			{
				$this.removeClass('selected');
			}
			else
			{
				$this.addClass('selected');
				$this.siblings().removeClass('selected');
			}
		},

		toggleHide: function()
		{
			$this = $(this.el);

			if ($this.hasClass('hidden'))
			{
				$this.removeClass('hidden');
				$(this.el).find('.hide').html('[-]');
			}
			else
			{
				$this.addClass('hidden');
				$(this.el).find('.hide').html('[+]');
			}
		},
	});

	var ControlPane = Backbone.View.extend(
	{
		el: $('#controlPane'),

		template: _.template($('#controlPaneTemplate').html()),

		events:
		{
			'click #addShape': 'createShape',
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

		addShape: function(shape)
		{
			var view = new ShapeView({model: shape});
			this.$('#shapeList').append(view.render().el);
		},
	});

	var controlPane = new ControlPane;
});

