var canvas;
var graph;
var points;

var clicking = false;

function canvasHandler()
{
	this.$canvas = $('#canvas');
	this.context = $('canvas')[0].getContext('2d');

	// resize the canvas to take advantage of extra viewport space
	this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#heading').height()));
	this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#heading').height()));
}

canvasHandler.prototype.height = function()
{
	return this.$canvas.height();
}

canvasHandler.prototype.width = function()
{
	return this.$canvas.width();
}

canvasHandler.prototype.offsetLeft = function()
{
	return this.$canvas.offset().left;
}

canvasHandler.prototype.offsetTop = function()
{
	return this.$canvas.offset().top;
}

canvasHandler.prototype.getX = function(x)
{
	return x - this.offsetLeft();
}

canvasHandler.prototype.getY = function(y)
{
	return y - this.offsetTop();
}

canvasHandler.prototype.clear = function()
{
	this.context.clearRect(0,0,this.width(),this.height());
}

function colorControl()
{
	var $colorDiv = $('<div/>');
	$colorDiv.addClass('colorSelector');

	var $blueLabel = $('<label/>');
	var $blueInput = $('<input/>');
	$blueInput.addClass('color');
	$blueInput.attr('type','radio');
	$blueInput.attr('name','color');
	$blueInput.attr('value','rgba(32,32,128,1)');
	$blueLabel.append($blueInput);
	$blueLabel.append('blue');

	var $greenLabel = $('<label/>');
	var $greenInput = $('<input/>');
	$greenInput.addClass('color');
	$greenInput.attr('type','radio');
	$greenInput.attr('name','color');
	$greenInput.attr('value','rgba(32,128,32,1)');
	$greenInput.attr('checked','checked');
	$greenLabel.append($greenInput);
	$greenLabel.append('green');

	var $redLabel = $('<label/>');
	var $redInput = $('<input/>');
	$redInput.addClass('color');
	$redInput.attr('type','radio');
	$redInput.attr('name','color');
	$redInput.attr('value','rgba(128,32,32,1)');
	$redLabel.append($redInput);
	$redLabel.append('red');

	$colorDiv.append($blueLabel);
	$colorDiv.append($greenLabel);
	$colorDiv.append($redLabel);

	return $colorDiv;
}

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

//	$graphForm.text('size');
// 	$graphForm.append($sizeInput);
// 	$graphForm.append($graphSubmit);
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
	$conicDiv.addClass('circle');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('circle');

	var $diameterDiv = $('<div/>');
	var $diameterInput = $('<input/>');
	$diameterInput.addClass('diameter');
	$diameterInput.attr('type','text');
	$diameterInput.attr('name','diameter');

	$diameterDiv.text('Diameter');
	$diameterDiv.append($diameterInput);
	$conicForm.append($diameterDiv);
	$conicForm.append(colorControl());
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function addEllipseControl($controlPane)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('ellipse');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('ellipse');

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

	$heightDiv.text('Height');
	$heightDiv.append($heightInput);
	$widthDiv.text('Width');
	$widthDiv.append($widthInput);
	$conicForm.append($heightDiv);
	$conicForm.append($widthDiv);
	$conicForm.append(colorControl());
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function cartesianPlane()
{
	this.defaultHeight = 21;
	this.defaultWidth = 21;
	this.defaultColor = "rgba(1,1,1,0.1)";
	this.defaultHighlight = "rgba(1,1,1,0.2)";

	this.height;
	this.width;
	this.scale;
	this.color = this.defaultColor;
	this.highlight = this.defaultHighlight;
	
	this.reset();
}

cartesianPlane.prototype.reset = function()
{
	this.height = this.defaultHeight;
	this.width = this.defaultWidth;

	this.resize(this.height,this.width);
}

cartesianPlane.prototype.ensureOddHeight = function()
{
	if ((this.height%2) == 0)
		this.height += 1;
}

cartesianPlane.prototype.ensureOddWidth = function()
{
	if ((this.width%2) == 0)
		this.width += 1;
}

// resize if graph needs to be enlarged
cartesianPlane.prototype.resize = function(height,width)
{
	if (height > this.height)
	{
		this.height = height;
		this.ensureOddHeight();
	}

	if (width > this.width)
	{
		this.width = width;
		this.ensureOddWidth();
	}

	var xScale = (canvas.width()-1) / this.width; // 'graph width - 1' so we're not drawing right up to the border
	var yScale = (canvas.height()-1) / this.height; // 'graph height - 1' so we're not drawing right up to the border

	if (xScale <= yScale)
	{
		this.scale = xScale;
		this.height = parseInt(canvas.height() / this.scale);
		this.ensureOddHeight();
	}
	else
	{
		this.scale = yScale;
		this.width = parseInt(canvas.width() / this.scale);
		this.ensureOddWidth();
	}
}

cartesianPlane.prototype.getX = function(x)
{
	return (Math.floor(x/this.scale)) - (Math.floor(this.width/2));
}

cartesianPlane.prototype.getY = function(y)
{
	return (Math.floor(this.height/2)) - (Math.floor(y/this.scale));
}

cartesianPlane.prototype.draw = function(row,col,x,y)
{
	canvas.context.beginPath();

	canvas.context.fillStyle = this.color;
	canvas.context.rect(col*graph.scale+1,row*graph.scale+1,graph.scale-1,graph.scale-1);

	if (((x==0) && ((y%2)==0)) || ((y==0) && ((x%2)==0)))
	{
		canvas.context.fillStyle = this.highlight;
		canvas.context.rect(col*graph.scale+1,row*graph.scale+1,graph.scale-1,graph.scale-1);
	}

	canvas.context.closePath();
	canvas.context.fill();
}

function point(x,y,color)
{
	this.x = x;
	this.y = y;
	this.color = color;
}

function points()
{
	this.pointList = [];
}

points.prototype.addPoint = function(x,y,color)
{
	this.pointList = this.pointList.concat(new point(x,y,color));
}

points.prototype.draw = function()
{
	var maxX = Math.floor(graph.width/2);
	var maxY = Math.floor(graph.height/2);

	$.each(this.pointList,function(index,point)
	{
		if ((Math.abs(point.x) <= maxX) && (Math.abs(point.y) <= maxY))
		{
			var col = maxX + point.x;
			var row = maxY - point.y;

			canvas.context.beginPath();

			canvas.context.fillStyle = point.color;
			canvas.context.rect(col*graph.scale+1,row*graph.scale+1,graph.scale-1,graph.scale-1);

			canvas.context.closePath();
			canvas.context.fill();
		}
	});
}

function circle(diameter,color)
{
	this.diameter = diameter;
	this.color = color;
}

circle.prototype.draw = function(row,col,x,y)
{
	if ((this.diameter % 2) == 0)
	{
		x -= 0.5;
		y += 0.5;
	}

	var radius = this.diameter / 2;
	var circleTest = Math.sqrt((x*x) + (y*y));

	if ((circleTest <= radius) && (circleTest > (radius-1)))
	{
		canvas.context.beginPath();

		canvas.context.fillStyle = this.color;
		canvas.context.rect(col*graph.scale+1,row*graph.scale+1,graph.scale-1,graph.scale-1);
		
		canvas.context.closePath();
		canvas.context.fill();
	}
}

function ellipse(height,width,color)
{
	this.height = height;
	this.width = width;
	this.color = color;
}

ellipse.prototype.draw = function(row,col,x,y)
{
	if ((this.width % 2) == 0)
		x -= 0.5;

	if ((this.height % 2) == 0)
		y += 0.5;

	var unit = 1;
	var a = this.width / 2;
	var b = this.height / 2;
	var perimeter = ((x*x)/(a*a) + (y*y)/(b*b));
	var inner = ((x*x)/((a-1)*(a-1)) + (y*y)/((b-1)*(b-1)));

	if ((perimeter <= unit) && (inner > unit))
	{
		canvas.context.beginPath();

		canvas.context.fillStyle = this.color;
		canvas.context.rect(col*graph.scale+1,row*graph.scale+1,graph.scale-1,graph.scale-1);
		
		canvas.context.closePath();
		canvas.context.fill();
	}
}

function draw()
{
	graph.reset();

	var $conics = $('div.conic');
	var conics = [];

	$($conics).each(function(index,$conic)
	{
		if ($($conic).is('.circle'))
		{
			var diameter = parseInt($($conic).find('input.diameter').val());

			if (diameter)
			{
				conics = conics.concat(new circle(diameter,$($conic).find('input.color:checked').val()));

				graph.resize(diameter+2,diameter+2); // "+2" to give some extra space around the shape
			}
		}
		else if ($($conic).is('.ellipse'))
		{
			var height = parseInt($($conic).find('input.height').val());
			var width = parseInt($($conic).find('input.width').val());

			if (height && width)
			{
				conics = conics.concat(new ellipse(height,width,$($conic).find('input.color:checked').val()));

				graph.resize(height+2,width+2); // "+2" to give some extra space around the shape
			}
		}
	});

	canvas.clear();

	for (var row=0; row<graph.height; row++)
	{
		var y = row - ((graph.height-1) / 2);

		for (var col=0; col<graph.width; col++)
		{
			var x = col - ((graph.width-1) / 2);

			graph.draw(row,col,x,y);

			$.each(conics,function(index,conic)
			{
				conic.draw(row,col,x,y);
			});
		}
	}

	points.draw();
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane();
	points = new points();
	
	// add conic form to config div
	var $controls = $('<div/>');
	$controls.addClass('controls');
	$controls.hide();

	$controls.append(graphControl());
	$controls.append(newConicControl());

	var $controlPane = $('#controlPane');
	$controlPane.append($controls);
	$controls.slideDown();

	// display the initial graph
	draw();

	$('input.newCircle').live('click',function(event)
	{
		addCircleControl($controlPane);
	});

	$('input.newEllipse').live('click',function(event)
	{
		addEllipseControl($controlPane);
	});

	$('div.conic').live('keyup',function(event)
	{
		draw();
	});

	$('input.color').live('click',function(event)
	{
		draw();
	});

	$('#canvas').mousedown(function(event)
	{
		clicking = true;
		points.addPoint(graph.getX(canvas.getX(event.pageX)), graph.getY(canvas.getY(event.pageY)), "rgba(32,32,32,1)");

		draw();
	});

	$('#canvas').mousemove(function(event)
	{
		if (clicking == false)
			return;

		points.addPoint(graph.getX(canvas.getX(event.pageX)), graph.getY(canvas.getY(event.pageY)), "rgba(32,32,32,1)");
		draw();
	});

	$('#canvas').mouseup(function()
	{
		clicking = false;
	});

	$('#canvas').mouseout(function()
	{
		clicking = false;
	});

});
