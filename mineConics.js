var canvas;
var graph;
var points;
var lines;
var circles;
var ellipses;

var clicking = false;
var startX;
var startY;

var drawingLine = false;
var curLine;

var drawingCircle = false;
var curCircle;

var drawingEllipse = false;
var curEllipse;

function canvasHandler()
{
	this.$canvas = $('#canvas');
	this.context = $('canvas')[0].getContext('2d');

	// resize the canvas to take advantage of extra viewport space
	this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#heading').height()));
	this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#heading').height()));

	this.height = this.$canvas.height();
	this.width = this.$canvas.width();
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
	this.context.clearRect(0,0,this.width,this.height);
}

function colorControl()
{
	var $colorDiv = $('<div/>');
	var $colorForm = $('<form/>');
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

	$colorForm.append($blueLabel);
	$colorForm.append($greenLabel);
	$colorForm.append($redLabel);
	$colorDiv.append($colorForm);

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

	var $newLineButton = $('<input/>');
	$newLineButton.addClass('newLine');
	$newLineButton.attr('type','button');
	$newLineButton.attr('value','add line');

	var $newCircleButton = $('<input/>');
	$newCircleButton.addClass('newCircle');
	$newCircleButton.attr('type','button');
	$newCircleButton.attr('value','add cirlce');

	var $newEllipseButton = $('<input/>');
	$newEllipseButton.addClass('newEllipse');
	$newEllipseButton.attr('type','button');
	$newEllipseButton.attr('value','add ellipse');

	$newConicForm.append($newLineButton);
	$newConicForm.append($newCircleButton);
	$newConicForm.append($newEllipseButton);
	$newConicDiv.append($newConicForm);

	return $newConicDiv;
}

function addLineControl($controlPane,lineID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic'); // ok, so maybe a line isn't a conic section
	$conicDiv.addClass('line');
	$conicDiv.attr('id','line'+lineID);

	var $startDiv = $('<div/>');
	var $startXInput = $('<input/>');
	var $startYInput = $('<input/>');
	$startDiv.text('Start');
	$startXInput.addClass('startX');
	$startYInput.addClass('startY');
	$startXInput.attr('type','text');
	$startYInput.attr('type','text');
	$startXInput.attr('name','startX');
	$startYInput.attr('name','startY');
	$startDiv.append($startXInput);
	$startDiv.append($startYInput);

	var $endDiv = $('<div/>');
	var $endXInput = $('<input/>');
	var $endYInput = $('<input/>');
	$endDiv.text('End');
	$endXInput.addClass('endX');
	$endYInput.addClass('endY');
	$endXInput.attr('type','text');
	$endYInput.attr('type','text');
	$endXInput.attr('name','endX');
	$endYInput.attr('name','endY');
	$endDiv.append($endXInput);
	$endDiv.append($endYInput);

	$conicDiv.append($startDiv);
	$conicDiv.append($endDiv);
	$conicDiv.append(colorControl());
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();

	return $conicDiv;
}

function addCircleControl($controlPane,circleID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('circle');
	$conicDiv.attr('id','circle'+circleID);

	var $centerDiv = $('<div/>');
	var $circleXInput = $('<input/>');
	var $circleYInput = $('<input/>');
	$centerDiv.text('Center');
	$circleXInput.addClass('circleX');
	$circleYInput.addClass('circleY');
	$circleXInput.attr('type','text');
	$circleYInput.attr('type','text');
	$circleXInput.attr('name','circleX');
	$circleYInput.attr('name','circleY');
	$centerDiv.append($circleXInput);
	$centerDiv.append($circleYInput);

	var $radiusDiv = $('<div/>');
	var $radiusInput = $('<input/>');
	$radiusDiv.text('radius');
	$radiusInput.addClass('radius');
	$radiusInput.attr('type','text');
	$radiusInput.attr('name','radius');
	$radiusDiv.append($radiusInput);

	$conicDiv.append($centerDiv);
	$conicDiv.append($radiusDiv);
	$conicDiv.append(colorControl());
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();

	return $conicDiv;
}

function addEllipseControl($controlPane,ellipseID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('ellipse');
	$conicDiv.attr('id','ellipse'+ellipseID);

	var $centerDiv = $('<div/>');
	var $ellipseXInput = $('<input/>');
	var $ellipseYInput = $('<input/>');
	$centerDiv.text('Center');
	$ellipseXInput.addClass('ellipseX');
	$ellipseYInput.addClass('ellipseY');
	$ellipseXInput.attr('type','text');
	$ellipseYInput.attr('type','text');
	$ellipseXInput.attr('name','ellipseX');
	$ellipseYInput.attr('name','ellipseY');
	$centerDiv.append($ellipseXInput);
	$centerDiv.append($ellipseYInput);

	var $radiusXDiv = $('<div/>');
	var $radiusXInput = $('<input/>');
	$radiusXDiv.text('Radius X');
	$radiusXInput.addClass('radiusX');
	$radiusXInput.attr('type','text');
	$radiusXInput.attr('name','radiusX');
	$radiusXDiv.append($radiusXInput);

	var $radiusYDiv = $('<div/>');
	var $radiusYInput = $('<input/>');
	$radiusYDiv.text('Radius Y');
	$radiusYInput.addClass('radiusY');
	$radiusYInput.attr('type','text');
	$radiusYInput.attr('name','radiusY');
	$radiusYDiv.append($radiusYInput);

	$conicDiv.append($centerDiv);
	$conicDiv.append($radiusXDiv);
	$conicDiv.append($radiusYDiv);
	$conicDiv.append(colorControl());
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();

	return $conicDiv;
}

function cartesianPlane()
{
	this.scale = 25;
	this.color = "rgba(1,1,1,0.1)";
	this.highlight = "rgba(1,1,1,0.2)";
	this.originX = canvas.width / 2; // distance in pixels from upper left corner to 0,0
	this.originY = canvas.height / 2; // distance in pixels from upper left corner to 0,0
	this.interval = 2; // how often a marker is drawn along the axes
}

cartesianPlane.prototype.getOriginX = function()
{
	return Math.floor(this.originX);
}

cartesianPlane.prototype.getOriginY = function()
{
	return Math.floor(this.originY);
}

cartesianPlane.prototype.moveOriginX = function(delta)
{
	this.originX = Math.floor((this.originX*1000) + (delta*1000)) / 1000;
}

cartesianPlane.prototype.moveOriginY = function(delta)
{
	this.originY = Math.floor((this.originY*1000) + (delta*1000)) / 1000;
}

cartesianPlane.prototype.getX = function(x)
{
	return Math.round((x - this.getOriginX()) / this.scale);
}

cartesianPlane.prototype.getY = function(y)
{
	return Math.round((this.getOriginY() - y) / this.scale);
}

cartesianPlane.prototype.fill = function(row,col,color)
{
	var width = canvas.width;
	var height = canvas.height;
	var scale = this.scale;

	var cols = Math.floor(width / scale);
	var rows = Math.floor(height / scale);

	var xOffset = ((this.getOriginX() - (scale/2)) % scale);
	var yOffset = ((this.getOriginY() - (scale/2)) % scale);

	canvas.context.beginPath();
	canvas.context.fillStyle = color;
	canvas.context.rect(col*scale+xOffset,row*scale+yOffset,scale-1,scale-1);
	canvas.context.closePath();
	canvas.context.fill();
}

cartesianPlane.prototype.plot = function(x,y,color)
{
	var upperLeftX = -parseInt((this.getOriginX() - (this.scale/2)) / this.scale);
	var upperLeftY = parseInt((this.getOriginY() - (this.scale/2)) / this.scale);

	this.fill(upperLeftY-y,x-upperLeftX,color);
}

cartesianPlane.prototype.draw = function()
{
	var width = canvas.width;
	var height = canvas.height;
	var scale = this.scale;

	// fill with background color
	canvas.context.beginPath();
	canvas.context.fillStyle = this.color;
	canvas.context.rect(0,0,width,height);
	canvas.context.closePath();
	canvas.context.fill();

	var cols = Math.floor(width / scale);
	var xOffset = ((this.getOriginX() - (scale/2)) % scale);

	for (var col=0; col<=cols; col++)
	{
		canvas.context.beginPath();
		canvas.context.fillStyle = "rgba(255,255,255,1)";
		canvas.context.rect((col * scale) + xOffset, 0, 1, height);
		canvas.context.closePath();
		canvas.context.fill();

		// draw marks along the X axis
		var x = col - parseInt((this.getOriginX() + (scale/2)) / scale);
		if ((x % this.interval) == 0)
			this.plot(x,0,this.highlight);
		else if ((col == cols) && (((x+1) % this.interval) == 0))
			this.plot(x+1,0,this.highlight); // slight hack for small slivers at the edge
	}

	var rows = Math.floor(height / scale);
	var yOffset = ((this.getOriginY() - (scale/2)) % scale);

	for (var row=0; row<=rows; row++)
	{
		canvas.context.beginPath();
		canvas.context.fillStyle = "rgba(255,255,255,1)";
		canvas.context.rect(0, (row * scale) + yOffset, width, 1);
		canvas.context.closePath();
		canvas.context.fill();

		// draw marks along the Y axis
		var y = parseInt((this.getOriginY() - (scale/2)) / scale) - row;
		if ((y % this.interval) == 0)
			this.plot(0,y,this.highlight);
		else if ((row == 0) && (((y+1) % this.interval) == 0))
			this.plot(0,y+1,this.highlight); // slight hack for small slivers at the edge
	}
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

function line($lineControl)
{
	this.x0;
	this.y0;
	this.x1;
	this.y1;
	this.color = "rgba(0,0,0,1)";
	this.$lineControl = $lineControl;
}

line.prototype.updateStartX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.x0 = testNum;

	this.$lineControl.find('input.startX').val(this.x0);
}

line.prototype.updateStartY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.y0 = testNum;

	this.$lineControl.find('input.startY').val(this.y0);
}

line.prototype.updateEndX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.x1 = testNum;

	this.$lineControl.find('input.endX').val(this.x1);
}

line.prototype.updateEndY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.y1 = testNum;

	this.$lineControl.find('input.endY').val(this.y1);
}

line.prototype.updateColor = function(newColor)
{
	this.color = newColor;
}

// Bresenham's line algorithm
line.prototype.draw = function()
{
	if ((this.x0 != null) && (this.y0 != null) && (this.x1 != null) && (this.y1 != null))
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
}

function lines()
{
	this.lineList = [];
}

lines.prototype.addLine = function($controlPane)
{
	var newLineIndex = this.lineList.length;

	var $newLineControl = addLineControl($controlPane,newLineIndex);
	this.lineList = this.lineList.concat(new line($newLineControl));

	return newLineIndex;
}

lines.prototype.updateLineStartX = function(lineIndex,newX)
{
	this.lineList[lineIndex].updateStartX(newX);
}

lines.prototype.updateLineStartY = function(lineIndex,newY)
{
	this.lineList[lineIndex].updateStartY(newY);
}

lines.prototype.updateLineEndX = function(lineIndex,newX)
{
	this.lineList[lineIndex].updateEndX(newX);
}

lines.prototype.updateLineEndY = function(lineIndex,newY)
{
	this.lineList[lineIndex].updateEndY(newY);
}

lines.prototype.updateLineColor = function(lineIndex,newColor)
{
	this.lineList[lineIndex].updateColor(newColor);
}

lines.prototype.draw = function()
{
	$.each(this.lineList,function(index,line)
	{
		line.draw();
	});
}

function circle($circleControl)
{
	this.centerX;
	this.centerY;
	this.radius;
	this.color = "rgba(0,0,0,1)";
	this.$circleControl = $circleControl;
}

circle.prototype.updateCenterX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.centerX = testNum;

	this.$circleControl.find('input.circleX').val(this.centerX);
}

circle.prototype.updateCenterY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.centerY = testNum;

	this.$circleControl.find('input.circleY').val(this.centerY);
}

circle.prototype.updateRadius = function(newRadius)
{
	var testNum = Math.abs(parseInt(newRadius));

	if (!isNaN(testNum))
		this.radius = testNum;

	this.$circleControl.find('input.radius').val(this.radius);
}

circle.prototype.updateColor = function(newColor)
{
	this.color = newColor;
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
	if ((this.centerX != null) && (this.centerY != null) && (this.radius != null))
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
}

function circles()
{
	this.circleList = [];
}

circles.prototype.addCircle = function($controlPane)
{
	var newCircleIndex = this.circleList.length;

	var $newCircleControl = addCircleControl($controlPane,newCircleIndex);
	this.circleList = this.circleList.concat(new circle($newCircleControl));

	return newCircleIndex;
}

circles.prototype.updateCircleCenterX = function(circleIndex,newX)
{
	this.circleList[circleIndex].updateCenterX(newX);
}

circles.prototype.updateCircleCenterY = function(circleIndex,newY)
{
	this.circleList[circleIndex].updateCenterY(newY);
}

circles.prototype.updateCircleRadius = function(circleIndex,newRadius)
{
	this.circleList[circleIndex].updateRadius(newRadius);
}

circles.prototype.updateCircleColor = function(circle,newColor)
{
	this.circleList[circle].updateColor(newColor);
}

circles.prototype.draw = function()
{
	$.each(this.circleList,function(index,circle)
	{
		circle.draw();
	});
}

function ellipse($ellipseControl)
{
	this.centerX;
	this.centerY;
	this.radiusX;
	this.radiusY;
	this.color = "rgba(0,0,0,1)";
	this.$ellipseControl = $ellipseControl;
}

ellipse.prototype.updateCenterX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.centerX = testNum;

	this.$ellipseControl.find('input.ellipseX').val(this.centerX);
}

ellipse.prototype.updateCenterY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.centerY = testNum;

	this.$ellipseControl.find('input.ellipseY').val(this.centerY);
}

ellipse.prototype.updateRadiusX = function(newRadiusX)
{
	var testNum = Math.abs(parseInt(newRadiusX));

	if (testNum)
		this.radiusX = testNum;

	this.$ellipseControl.find('input.radiusX').val(this.radiusX);
}

ellipse.prototype.updateRadiusY = function(newRadiusY)
{
	var testNum = Math.abs(parseInt(newRadiusY));

	if (testNum)
		this.radiusY = testNum;

	this.$ellipseControl.find('input.radiusY').val(this.radiusY);
}

ellipse.prototype.updateColor = function(newColor)
{
	this.color = newColor;
}

// helper for midpoint ellipse algorithm
ellipse.prototype.plotFourPoints = function(x,y)
{
	graph.plot(this.centerX+x,this.centerY+y,this.color);
	graph.plot(this.centerX-x,this.centerY+y,this.color);
	graph.plot(this.centerX-x,this.centerY-y,this.color);
	graph.plot(this.centerX+x,this.centerY-y,this.color);
}

// midpoint ellipse algorithm
ellipse.prototype.draw = function()
{
	if ((this.centerX != null) && (this.centerY != null) && this.radiusX && this.radiusY)
	{
		var x = this.radiusX;
		var y = 0;
		var twoASquare = 2 * this.radiusX * this.radiusX;
		var twoBSquare = 2 * this.radiusY * this.radiusY;
		var changeX = this.radiusY * this.radiusY * (1 - (2 * this.radiusX));
		var changeY = this.radiusX * this.radiusX;
		var stoppingX = twoBSquare * this.radiusX;
		var stoppingY = 0;
		var error = 0;

		while (stoppingX >= stoppingY)
		{
			this.plotFourPoints(x,y);

			y++;
			stoppingY += twoASquare;
			error += changeY;
			changeY += twoASquare;

			if (((2 * error) + changeX) > 0)
			{
				x--;
				stoppingX -= twoBSquare;
				error += changeX;
				changeX += twoBSquare;
			}
		}

		x = 0;
		y = this.radiusY;
		changeX = this.radiusY * this.radiusY;
		changeY = this.radiusX * this.radiusX * (1 - (2 * this.radiusY));
		stoppingX = 0;
		stoppingY = twoASquare * this.radiusY;
		error = 0;

		while (stoppingX <= stoppingY)
		{
			this.plotFourPoints(x,y);

			x++;
			stoppingX += twoBSquare;
			error += changeX;
			changeX += twoBSquare;

			if (((2 * error) + changeY) > 0)
			{
				y--;
				stoppingY -= twoASquare;
				error += changeY;
				changeY += twoASquare;
			}
		}
	}
}

function ellipses()
{
	this.ellipseList = [];
}

ellipses.prototype.addEllipse = function($controlPane)
{
	var newEllipseIndex = this.ellipseList.length;

	var $newEllipseControl = addEllipseControl($controlPane,newEllipseIndex);
	this.ellipseList = this.ellipseList.concat(new ellipse($newEllipseControl));

	return newEllipseIndex;
}

ellipses.prototype.updateEllipseCenterX = function(ellipseIndex,newX)
{
	this.ellipseList[ellipseIndex].updateCenterX(newX);
}

ellipses.prototype.updateEllipseCenterY = function(ellipseIndex,newY)
{
	this.ellipseList[ellipseIndex].updateCenterY(newY);
}

ellipses.prototype.updateEllipseRadiusX = function(ellipseIndex,newRadiusX)
{
	this.ellipseList[ellipseIndex].updateRadiusX(newRadiusX);
}

ellipses.prototype.updateEllipseRadiusY = function(ellipseIndex,newRadiusY)
{
	this.ellipseList[ellipseIndex].updateRadiusY(newRadiusY);
}

ellipses.prototype.updateEllipseColor = function(ellipseIndex,newColor)
{
	this.ellipseList[ellipseIndex].updateColor(newColor);
}

ellipses.prototype.draw = function()
{
	$.each(this.ellipseList,function(index,ellipse)
	{
		ellipse.draw();
	});
}

function draw()
{
	canvas.clear();

	graph.draw();
	points.draw();
	lines.draw();
	circles.draw();
	ellipses.draw();
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane();
	points = new points();
	lines = new lines();
	circles = new circles();
	ellipses = new ellipses();
	
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
	setInterval(draw,100);

	$('input.newLine').click(function(event)
	{
		curLine = lines.addLine($controlPane);
		drawingLine = true;
	});

	$('input.newCircle').click(function(event)
	{
		curCircle = circles.addCircle($controlPane);
		drawingCircle = true;
	});

	$('input.newEllipse').click(function(event)
	{
		curEllipse = ellipses.addEllipse($controlPane);
		drawingEllipse = true;
	});

	// handle updates to line start X values
	$('input.startX').live('change',function()
	{
		var $startX = $(this);
		var lineID = $startX.closest('div.line').attr('id').replace('line','');

		lines.updateLineStartX(lineID,$startX.val());
	});

	// handle updates to line start Y values
	$('input.startY').live('change',function()
	{
		var $startY = $(this);
		var lineID = $startY.closest('div.line').attr('id').replace('line','');

		lines.updateLineStartY(lineID,$startY.val());
	});

	// handle updates to line end X values
	$('input.endX').live('change',function()
	{
		var $endX = $(this);
		var lineID = $endX.closest('div.line').attr('id').replace('line','');

		lines.updateLineEndX(lineID,$endX.val());
	});

	// handle updates to line end Y values
	$('input.endY').live('change',function()
	{
		var $endY = $(this);
		var lineID = $endY.closest('div.line').attr('id').replace('line','');

		lines.updateLineEndY(lineID,$endY.val());
	});

	// handle updates to circle center X values
	$('input.circleX').live('change',function()
	{
		var $circleX = $(this);
		var circleID = $circleX.closest('div.circle').attr('id').replace('circle','');

		circles.updateCircleCenterX(circleID,$circleX.val());
	});

	// handle updates to circle center Y values
	$('input.circleY').live('change',function()
	{
		var $circleY = $(this);
		var circleID = $circleY.closest('div.circle').attr('id').replace('circle','');

		circles.updateCircleCenterY(circleID,$circleY.val());
	});

	// handle updates to circle radius values
	$('input.radius').live('change',function()
	{
		var $radius = $(this);
		var circleID = $radius.closest('div.circle').attr('id').replace('circle','');

		circles.updateCircleRadius(circleID,$radius.val());
	});

	// handle updates to ellipse center X values
	$('input.ellipseX').live('change',function()
	{
		var $ellipseX = $(this);
		var ellipseID = $ellipseX.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.updateEllipseCenterX(ellipseID,$ellipseX.val());
	});

	// handle updates to ellipse center Y values
	$('input.ellipseY').live('change',function()
	{
		var $ellipseY = $(this);
		var ellipseID = $ellipseY.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.updateEllipseCenterY(ellipseID,$ellipseY.val());
	});

	// handle updates to ellipse radius X values
	$('input.radiusX').live('change',function()
	{
		var $radiusX = $(this);
		var ellipseID = $radiusX.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.updateEllipseRadiusX(ellipseID,$radiusX.val());
	});

	// handle updates to ellipse radius Y values
	$('input.radiusY').live('change',function()
	{
		var $radiusY = $(this);
		var ellipseID = $radiusY.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.updateEllipseRadiusY(ellipseID,$radiusY.val());
	});

	$('div.colorSelector').live('change',function()
	{
		var $conic = $(this).closest('div.conic');

		if ($($conic).is('.line'))
		{
			var lineID = $conic.attr('id').replace('line','');

			lines.updateLineColor(lineID,$($conic).find('input.color:checked').val());
		}
		else if ($($conic).is('.circle'))
		{
			var circleID = $conic.attr('id').replace('circle','');

			circles.updateCircleColor(circleID,$($conic).find('input.color:checked').val());
		}
		else if ($($conic).is('.ellipse'))
		{
			var ellipseID = $conic.attr('id').replace('ellipse','');

			ellipses.updateEllipseColor(ellipseID,$($conic).find('input.color:checked').val());
		}
	});

	$('#canvas').mousedown(function(event)
	{
		clicking = true;

		if (drawingLine)
		{
			startX = graph.getX(canvas.getX(event.pageX));
			startY = graph.getY(canvas.getY(event.pageY));

			lines.updateLineStartX(curLine,startX);
			lines.updateLineStartY(curLine,startY);
			lines.updateLineEndX(curLine,startX);
			lines.updateLineEndY(curLine,startY);
		}
		else if (drawingCircle)
		{
			startX = graph.getX(canvas.getX(event.pageX));
			startY = graph.getY(canvas.getY(event.pageY));

			circles.updateCircleCenterX(curCircle,startX);
			circles.updateCircleCenterY(curCircle,startY);
			circles.updateCircleRadius(curCircle,0);
		}
		else if (drawingEllipse)
		{
			startX = graph.getX(canvas.getX(event.pageX));
			startY = graph.getY(canvas.getY(event.pageY));

			ellipses.updateEllipseCenterX(curEllipse,startX);
			ellipses.updateEllipseCenterY(curEllipse,startY);
			ellipses.updateEllipseRadiusX(curEllipse,1);
			ellipses.updateEllipseRadiusY(curEllipse,1);
		}
		else // click and drag panning
		{
			startX = canvas.getX(event.pageX);
			startY = canvas.getY(event.pageY);
		}
	});

	$('#canvas').mousemove(function(event)
	{
		if (!clicking)
			return;

		if (drawingLine)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			lines.updateLineEndX(curLine,curX);
			lines.updateLineEndY(curLine,curY);
		}
		else if (drawingCircle)
		{
			var deltaX = startX - graph.getX(canvas.getX(event.pageX));
			var deltaY = startY - graph.getY(canvas.getY(event.pageY));

			circles.updateCircleRadius(curCircle,Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));
		}
		else if (drawingEllipse)
		{
			var deltaX = Math.abs(startX - graph.getX(canvas.getX(event.pageX)));
			var deltaY = Math.abs(startY - graph.getY(canvas.getY(event.pageY)));

			ellipses.updateEllipseRadiusX(curEllipse,deltaX);
			ellipses.updateEllipseRadiusY(curEllipse,deltaY);
		}
		else // click and drag panning
		{
			var curX = canvas.getX(event.pageX);
			var curY = canvas.getY(event.pageY);

			graph.moveOriginX(curX - startX);
			graph.moveOriginY(curY - startY);

			startX = curX;
			startY = curY
		}
	});

	$(document).mouseup(function(event)
	{
 		if (!clicking)
			return;

		if (drawingLine)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			lines.updateLineEndX(curLine,curX);
			lines.updateLineEndY(curLine,curY);

			drawingLine = false;
		}
		else if (drawingCircle)
		{
			var deltaX = startX - graph.getX(canvas.getX(event.pageX));
			var deltaY = startY - graph.getY(canvas.getY(event.pageY));

			circles.updateCircleRadius(curCircle,Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));

			drawingCircle = false;
		}
		else if (drawingEllipse)
		{
			var deltaX = Math.abs(startX - graph.getX(canvas.getX(event.pageX)));
			var deltaY = Math.abs(startY - graph.getY(canvas.getY(event.pageY)));

			ellipses.updateEllipseRadiusX(curEllipse,deltaX);
			ellipses.updateEllipseRadiusY(curEllipse,deltaY);

			drawingEllipse = false;
		}
		else // click and drag panning
		{
			var curX = canvas.getX(event.pageX);
			var curY = canvas.getY(event.pageY);

			graph.moveOriginX(curX - startX);
			graph.moveOriginY(curY - startY);
		}

		clicking = false;
	});

	$('#canvas').mousewheel(function(event,delta)
	{
		var scaleTemp = graph.scale;

		graph.scale += delta;
		graph.scale = parseInt(graph.scale * 1000) / 1000;

		if (graph.scale < 3)
			graph.scale = 3;
		else if (graph.scale > 50)
			graph.scale = 50;
		else
		{
			var mouseX = canvas.getX(event.pageX)-graph.getOriginX();
			var mouseY = canvas.getY(event.pageY)-graph.getOriginY();

			graph.moveOriginX(-(mouseX / scaleTemp) * delta);
			graph.moveOriginY(-(mouseY / scaleTemp) * delta);
		}
	});
});
