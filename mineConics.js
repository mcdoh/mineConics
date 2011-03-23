function graphControl()
{
	var $graphDiv = $('<div/>');
	$graphDiv.addClass('control');

	var $graphForm = $('<form/>');
	$graphForm.addClass('graph');

	var $sizeInput = $('<input/>');
	$sizeInput.addClass('graph');
	$sizeInput.addClass('size');
	$sizeInput.attr('type','text');
	$sizeInput.attr('name','size');

	var $graphSubmit = $('<input/>');
	$graphSubmit.addClass('graph');
	$graphSubmit.attr('type','submit');
	$graphSubmit.attr('value','update');

	$graphForm.text('size');
	$graphForm.append($sizeInput);
	$graphForm.append($graphSubmit);
	$graphDiv.append($graphForm);

	return $graphDiv;
}

function newConicControl()
{
	var $newConicDiv = $('<div/>');
	$newConicDiv.addClass('control');

	var $newConicForm = $('<form/>');
	$newConicForm.addClass('newConic');

	var $newCircleButton = $('<input/>');
	$newCircleButton.addClass('newCircle');
	$newCircleButton.attr('type','button');
	$newCircleButton.attr('value','add cirlce');

	var $newEllipseButton = $('<input/>');
	$newEllipseButton.addClass('newEllipse');
	$newEllipseButton.attr('type','button');
	$newEllipseButton.attr('value','add ellipse');

	$newConicForm.append($newCircleButton);
	$newConicForm.append($newEllipseButton);
	$newConicDiv.append($newConicForm);

	return $newConicDiv;
}

function addCircleControl($controlPane)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('circle');

	var $diameterDiv = $('<div/>');
	var $diameterInput = $('<input/>');
	$diameterInput.addClass('diameter');
	$diameterInput.attr('type','text');
	$diameterInput.attr('name','diameter');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conic');
	$conicSubmit.attr('type','submit');
	$conicSubmit.attr('value','Go');

	$diameterDiv.text('Diameter');
	$diameterDiv.append($diameterInput);
	$conicForm.append($diameterDiv);
	$conicForm.append($conicSubmit);
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function addEllipseControl($controlPane)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');

	var $heightDiv = $('<div/>');
	var $heightInput = $('<input/>');
	$heightInput.addClass('height');
	$heightInput.attr('type','text');
	$heightInput.attr('name','height');

	var $widthDiv = $('<div/>');
	var $widthInput = $('<input/>');
	$widthInput.addClass('width');
	$widthInput.attr('type','text');
	$widthInput.attr('name','width');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conic');
	$conicSubmit.attr('type','submit');
	$conicSubmit.attr('value','Go');

	$heightDiv.text('Height');
	$heightDiv.append($heightInput);
	$widthDiv.text('Width');
	$widthDiv.append($widthInput);
	$conicForm.append($heightDiv);
	$conicForm.append($widthDiv);
	$conicForm.append($conicSubmit);
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function cartesianPlane(height,width,color,highlight)
{
	this.height = height;
	this.width = width;
	this.color = color;
	this.highlight = highlight;
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

	ctx.fillStyle = this.color;
	ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);

	if (((x==0) && ((y%2)==0)) || ((y==0) && ((x%2)==0)))
	{
		ctx.fillStyle = this.highlight;
		ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
	}

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
	if (this.height >= this.width)
		return this.height;
	else
		return this.width;
}

ellipse.prototype.draw = function(ctx,row,col,graphScale,x,y)
{
	var unit = 1;
	var a = this.width / 2;
	var b = this.height / 2;
	var perimeter = ((x*x)/(a*a) + (y*y)/(b*b));
	var inner = ((x*x)/((a-1)*(a-1)) + (y*y)/((b-1)*(b-1)));

	if ((perimeter <= unit) && (inner > unit))
	{
		ctx.beginPath();

		ctx.fillStyle = this.color;
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
//				if ((element.diameter % 2) == 0)
//					element.draw(ctx,row,col,graphScale,(x-0.5),(y+0.5));
//				else
					element.draw(ctx,row,col,graphScale,x,y);
			});
		}
	}
}

$(document).ready(function()
{
	var graph = new cartesianPlane(21,21,"rgba(1,1,1,.1)","rgba(1,1,1,.2)");
	var circles = [];

	// add conic form to config div
	var $controlPane = $('#controlPane');
	var $controls = $('<div/>');
	$controls.addClass('controls');
	$controls.hide();

	$controls.append(graphControl());
	$controls.append(newConicControl());
	$controlPane.append($controls);
	$controls.slideDown();

	// get a reference to the canvas
	var ctx = $('canvas')[0].getContext('2d');

	// display the initial graph
	draw(ctx,graph,circles);

	$('input.newCircle').live('click',function(event)
	{
		addCircleControl($controlPane);
	});

	$('input.newEllipse').live('click',function(event)
	{
		addEllipseControl($controlPane);
	});

	$('input.conic:submit').live('click',function(event)
	{
		event.preventDefault();

		// clear all current circles
		circles.splice(0,circles.length);

		$('form.conic').each(function(index,conic)
		{
			var diameter = parseInt($(conic).find('input.diameter').val());

			if (diameter)
				circles = circles.concat(new circle(diameter,"rgba(32,128,32,1)"));
			else
			{
				var height = parseInt($(conic).find('input.height').val());
				var width = parseInt($(conic).find('input.width').val());
				
				if (height && width)
					circles = circles.concat(new ellipse(height,width,"rgba(32,128,32,1)"));
			}

		});

		draw(ctx,graph,circles);
	});
});


$(window).load(function()
{
	var $header = $('#header');
	var $heading = $('#heading');
	var $controlPane = $('#controlPane');
	var $canvas = $('#canvas');

	// simply using the size of #heading as a relative margin size
	$canvas.height($(window).height() - $header.outerHeight(true) - $heading.height());
	$canvas.width($(window).width() - $controlPane.outerWidth(true) - $heading.height());
});
