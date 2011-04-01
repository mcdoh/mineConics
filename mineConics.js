var canvas;
var graph;
var points;
var lines;
var circles;

var clicking = false;
var startX;
var startY;

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

	var $radiusDiv = $('<div/>');
	var $radiusInput = $('<input/>');
	$radiusInput.addClass('radius');
	$radiusInput.attr('type','text');
	$radiusInput.attr('name','radius');

	$radiusDiv.text('radius');
	$radiusDiv.append($radiusInput);
	$conicForm.append($radiusDiv);
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

cartesianPlane.prototype.fill = function(row,col,color)
{
	canvas.context.beginPath();
	canvas.context.fillStyle = color;
	canvas.context.rect(col*this.scale+1,row*this.scale+1,this.scale-1,this.scale-1);
	canvas.context.closePath();
	canvas.context.fill();
}

cartesianPlane.prototype.plot = function(x,y,color)
{
	var maxX = Math.floor(this.width/2);
	var maxY = Math.floor(this.height/2);

	if ((Math.abs(x) <= maxX) && (Math.abs(y) <= maxY))
		this.fill(maxY-y,maxX+x,color);
}

cartesianPlane.prototype.draw = function(row,col,x,y)
{
	this.fill(row,col,this.color);

	// mark every even square along the axes
	if (((x==0) && ((y%2)==0)) || ((y==0) && ((x%2)==0)))
		this.fill(row,col,this.highlight);
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
	$.each(this.pointList,function(index,point)
	{
		graph.plot(point.x,point.y,point.color);
	});
}

function line(x0,y0,x1,y1,color)
{
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.color = color;
}

// Bresenham's line algorithm
line.prototype.draw = function()
{
	var x0 = this.x0;
	var x1 = this.x1;
	var y0 = this.y0;
	var y1 = this.y1;

	var steep = false;
	if (Math.abs(y1-y0) > Math.abs(x1-x0))
		steep = true;

	if (steep)
	{
		var temp = x0;
		x0 = y0;
		y0 = temp;

		temp = x1;
		x1 = y1;
		y1 = temp;
	}

	if (x0 > x1)
	{
		var temp = x0;
		x0 = x1;
		x1 = temp;

		temp = y0;
		y0 = y1;
		y1 = temp;
	}

	var deltaX = x1 - x0;
	var deltaY = Math.abs(y1 - y0);
	var error = deltaX / 2;
	var y = y0;

	var yStep;
	if (y0 < y1)
		yStep = 1;
	else
		yStep = -1;

	for (var x=x0; x<=x1; x++)
	{
		if (steep)
			graph.plot(y,x,this.color);
		else
			graph.plot(x,y,this.color);

		error -= deltaY;
		if (error < 0)
		{
			y += yStep;
			error += deltaX;
		}
	}
}

function lines()
{
	this.lineList = [];
}

lines.prototype.addLine = function(x0,y0,x1,y1,color)
{
	this.lineList = this.lineList.concat(new line(x0,y0,x1,y1,color));
}

lines.prototype.draw = function()
{
	$.each(this.lineList,function(index,line)
	{
		line.draw();
	});
}

function circle(centerX,centerY,radius,color)
{
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
	this.color = color;
}

// helper for midpoint circle algorithm
circle.prototype.plotFourPoints = function(x,y)
{
	graph.plot(this.centerX+x,this.centerY+y,this.color);

	if (x != 0)
		graph.plot(this.centerX-x,this.centerY+y,this.color);

	if (y != 0)
		graph.plot(this.centerX+x,this.centerY-y,this.color);

	if ((x != 0) && (y != 0))
		graph.plot(this.centerX-x,this.centerY-y,this.color);
}

// helper for midpoint circle algorithm
circle.prototype.plotEightPoints = function(x,y)
{
	this.plotFourPoints(x,y);

	if (x != y)
		this.plotFourPoints(y,x);
}

// midpoint circle algorithm
circle.prototype.draw = function()
{
	var x = this.radius;
	var y = 0;
	var error = -x;

	while (x >= y)
	{
		this.plotEightPoints(x,y);
		
		error += (2 * y) + 1;
		y++;

		if (error >= 0)
		{
			x--;
			error -= 2 * x;
		}
	}
}

function circles()
{
	this.circleList = [];
}

circles.prototype.clear = function()
{
	this.circleList.splice(0,this.circleList.length);
}

circles.prototype.addCircle = function(radius,color)
{
	this.circleList = this.circleList.concat(new circle(0,0,radius,color));
}

circles.prototype.draw = function()
{
	$.each(this.circleList,function(index,circle)
	{
		circle.draw();
	});
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
		graph.fill(row,col,this.color);
}

function draw()
{
	graph.reset();
	circles.clear();

	var $conics = $('div.conic');

	$($conics).each(function(index,$conic)
	{
		if ($($conic).is('.circle'))
		{
			var radius = parseInt($($conic).find('input.radius').val());

			if (radius)
			{
//				conics = conics.concat(new circle(radius,$($conic).find('input.color:checked').val()));

				circles.addCircle(radius,$($conic).find('input.color:checked').val());
				graph.resize(radius*2+3,radius*2+3); // "+3" to give some extra space around the shape
			}
		}
// 		else if ($($conic).is('.ellipse'))
// 		{
// 			var height = parseInt($($conic).find('input.height').val());
// 			var width = parseInt($($conic).find('input.width').val());
// 
// 			if (height && width)
// 			{
// 				conics = conics.concat(new ellipse(height,width,$($conic).find('input.color:checked').val()));
// 
// 				graph.resize(height+2,width+2); // "+2" to give some extra space around the shape
// 			}
// 		}
	});

	canvas.clear();

	for (var row=0; row<graph.height; row++)
	{
		var y = row - ((graph.height-1) / 2);

		for (var col=0; col<graph.width; col++)
		{
			var x = col - ((graph.width-1) / 2);

			graph.draw(row,col,x,y);

// 			$.each(conics,function(index,conic)
// 			{
// 				conic.draw(row,col,x,y);
// 			});
		}
	}

	points.draw();
	lines.draw();
	circles.draw();
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane();
	points = new points();
	lines = new lines();
	circles = new circles();
	
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
		startX = graph.getX(canvas.getX(event.pageX));
		startY = graph.getY(canvas.getY(event.pageY));

		draw();
	});

	$('#canvas').mousemove(function(event)
	{
		if (!clicking)
			return;

		draw();
	});

	$('#canvas').mouseup(function(event)
	{
		if (clicking)
		{
			lines.addLine(startX,startY,graph.getX(canvas.getX(event.pageX)), graph.getY(canvas.getY(event.pageY)), "rgba(32,32,192,1)");

			draw();
		}

		clicking = false;
	});

	$('#canvas').mouseout(function()
	{
		clicking = false;
	});
});
