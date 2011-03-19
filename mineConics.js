function addCircleControl($controlPane)
{
	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('circle');

	var $diameterInput = $('<input/>');
	$diameterInput.addClass('conic');
	$diameterInput.addClass('diameter');
	$diameterInput.attr('type','text');
	$diameterInput.attr('name','diameter');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conic');
	$conicSubmit.attr('type','submit');
	$conicSubmit.attr('value','Go');

	$conicForm.text('Diameter');
	$conicForm.append($diameterInput);
	$conicForm.append($conicSubmit);
	$conicForm.hide();

	$controlPane.append($conicForm);
	$conicForm.slideDown();
}

function addEllipseControl($controlPane)
{
	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');

	var $heightInput = $('<input/>');
	$heightInput.addClass('conic');
	$heightInput.addClass('height');
	$heightInput.attr('type','text');
	$heightInput.attr('name','height');

	var $widthInput = $('<input/>');
	$widthInput.addClass('conic');
	$widthInput.addClass('width');
	$widthInput.attr('type','text');
	$widthInput.attr('name','width');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conic');
	$conicSubmit.attr('type','submit');
	$conicSubmit.attr('value','Go');

	$conicForm.text('Height');
	$conicForm.append($heightInput);
	$conicForm.text('Width');
	$conicForm.append($widthInput);
	$conicForm.append($conicSubmit);
	$conicForm.hide();

	$controlPane.append($conicForm);
	$conicForm.slideDown();
}

function cartesianPlane(height,width,color)
{
	this.height = height;
	this.width = width;
	this.color = color;
}

cartesianPlane.prototype.getSize = function()
{
	if (this.height <= this.width)
		return this.height;
	else
		return this.width;
}

cartesianPlane.prototype.draw = function(ctx,row,col,graphScale,x,y)
{
	ctx.beginPath();

	if ((x==0) && ((y%2)==0))
		ctx.fillStyle = "rgba(1,1,1, 0.2)";
	else if ((y==0) && ((x%2)==0))
		ctx.fillStyle = "rgba(1,1,1, 0.2)";
	else
		ctx.fillStyle = "rgba(1,1,1, 0.1)";

	ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);

	ctx.closePath();
	ctx.fill();
}

function circle(diameter,color)
{
	this.diameter = diameter;
	this.color = color;
}

circle.prototype.getSize = function()
{
	return this.diameter;
}

circle.prototype.draw = function(ctx,row,col,graphScale,x,y)
{
	var radius = this.diameter / 2;
	var circleTest = Math.sqrt((x*x) + (y*y));

	if ((circleTest <= radius) && (circleTest > (radius-1)))
	{
		ctx.beginPath();

		ctx.fillStyle = this.color;
		ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
		ctx.closePath();
		ctx.fill();
	}
}

function ellipse(height,width,color)
{
	this.height = height;
	this.width = width;
	this.color = color;
}

ellipse.prototype.getSize = function()
{
	if (height >= width)
		return this.height;
	else
		return this.width;
}

ellipse.prototype.draw = function(ctx,row,col,graphScale,x,y)
{
	var unit = 1;
	var perimiter = ((x*x)/(this.width*this.width) + (y*y)/(this.height*this.height));
	var inner = ((x*x)/((this.width-1)*(this.width-1)) + (y*y)/((this.height-1)*(this.height-1)));

	if ((inner <= unit) && (inner > unit))
	{
		ctx.beginPath();

		ctx.fillStyle = color;
		ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
		ctx.closePath();
		ctx.fill();
	}
}

function draw(ctx,graph,circles)
{
	var graphHeight = $('canvas').height();
	var graphWidth = $('canvas').width();
	var graphSize = graph.getSize();

	// get largest shape
	$.each(circles,function(index,shape)
	{
		if ((shape.getSize()+2) > graphSize)
			graphSize = shape.getSize() + 2;
	});

	// ensure graph is of odd dimensions
	if ((graphSize%2) == 0)
		graphSize += 1;

	var graphScale = (graphHeight-1) / graphSize; // 'graphHeight-1' so we're not drawing right up to the border

	ctx.clearRect(0,0,graphWidth,graphHeight);

	for (var row=0; row<graphSize; row++)
	{
		var y = row - ((graphSize-1) / 2);

		for (var col=0; col<graphSize; col++)
		{
			var x = col - ((graphSize-1) / 2);

			graph.draw(ctx,row,col,graphScale,x,y);

			$.each(circles,function(index,element)
			{
				// adjust for drawing even circles
				if ((element.diameter % 2) == 0)
					element.draw(ctx,row,col,graphScale,(x-0.5),(y+0.5));
				else
					element.draw(ctx,row,col,graphScale,x,y);
			});
		}
	}
}

$(document).ready(function()
{
	var graph = new cartesianPlane(21,21,"rgba(1,1,1,.1)");
	var circles = [];

	// add conic form to config div
	var $controlPane = $('#controlPane');
	addCircleControl($controlPane);

	// get a reference to the canvas
	var ctx = $('canvas')[0].getContext('2d');

	// display the initial graph
	draw(ctx,graph,circles);

	$('input.conic:submit').live('click',function(event)
	{
		event.preventDefault();

		// clear all current circles
		circles.splice(0,circles.length);

		$('form.conic').each(function(index,conic)
		{
			var diameter = parseInt($(conic).find('input.conic').val());

			if (diameter)
				circles = circles.concat(new circle(diameter,"rgba(32,128,32,1)"));
		});

		draw(ctx,graph,circles);

		addCircleControl($controlPane);
	});
});
