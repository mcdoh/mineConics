var canvas;
var graph;
var lines;
var circles;
var ellipses;

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

	this.height = this.$canvas.height();
	this.width = this.$canvas.width();

	this.cursorOpenHand();
}

canvasHandler.prototype.cursorDefault = function()
{
	this.$canvas.css('cursor','default');
}

canvasHandler.prototype.cursorOpenHand = function()
{
	this.$canvas.css('cursor','url(openhand.cur),move');
}

canvasHandler.prototype.cursorClosedHand = function()
{
	this.$canvas.css('cursor','url(closedhand.cur),move');
}

canvasHandler.prototype.cursorCrosshair = function()
{
	this.$canvas.css('cursor','crosshair');
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

function titleBar(title)
{
	var $titleBarDiv = $('<div/>');
	$titleBarDiv.addClass('titleBar');

	var $closeDiv = $('<div/>');
	$closeDiv.addClass('close');
	$closeDiv.append('[X]');

	var $titleDiv = $('<div/>');
	$titleDiv.addClass('title');
	$titleDiv.append(title);

	var $hideDiv = $('<div/>');
	$hideDiv.addClass('hide');
	$hideDiv.text('[-]');

	$titleBarDiv.append($closeDiv);
	$titleBarDiv.append($titleDiv);
	$titleBarDiv.append($hideDiv);

	return $titleBarDiv;
}

function colorControl()
{
	var $colorDiv = $('<div/>');
	$colorDiv.addClass('colorSelector');

	var $colorForm = $('<form/>');
	var $colorTitle = $('<div/>');
	$colorForm.addClass('field');
	$colorTitle.addClass('fieldTitle');
	$colorTitle.text('rgb');

	var $redLabel = $('<label/>');
	var $redInput = $('<input/>');
	$redInput.addClass('color');
	$redInput.addClass('red');
	$redInput.attr('type','checkbox');
	$redInput.attr('name','color');
	$redLabel.append($redInput);

	var $greenLabel = $('<label/>');
	var $greenInput = $('<input/>');
	$greenInput.addClass('color');
	$greenInput.addClass('green');
	$greenInput.attr('type','checkbox');
	$greenInput.attr('name','color');
	$greenLabel.append($greenInput);

	var $blueLabel = $('<label/>');
	var $blueInput = $('<input/>');
	$blueInput.addClass('color');
	$blueInput.addClass('blue');
	$blueInput.attr('type','checkbox');
	$blueInput.attr('name','color');
	$blueLabel.append($blueInput);

	$colorForm.append($colorTitle);
	$colorForm.append($redLabel);
	$colorForm.append($greenLabel);
	$colorForm.append($blueLabel);

	var $hexDiv = $('<div/>');
	var $hexTitle = $('<div/>');
	var $hexInput = $('<input/>');
	$hexDiv.addClass('field');
	$hexTitle.addClass('fieldTitle');
	$hexTitle.text('hex');
	$hexInput.addClass('hexColor');
	$hexInput.val('#000000');
	$hexDiv.append($hexTitle);
	$hexDiv.append($hexInput);

	$colorDiv.append($colorForm);
	$colorDiv.append($hexDiv);

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
	$newConicDiv.addClass('newConics');

	var $newLineButton = $('<div/>');
	$newLineButton.addClass('newConic');
	$newLineButton.addClass('newLine');
	$newLineButton.text('[add line]');

	var $newCircleButton = $('<div/>');
	$newCircleButton.addClass('newConic');
	$newCircleButton.addClass('newCircle');
	$newCircleButton.text('[add cirlce]');

	var $newEllipseButton = $('<div/>');
	$newEllipseButton.addClass('newConic');
	$newEllipseButton.addClass('newEllipse');
	$newEllipseButton.text('[add ellipse]');

	$newConicDiv.append($newLineButton);
	$newConicDiv.append($newCircleButton);
	$newConicDiv.append($newEllipseButton);

	return $newConicDiv;
}

function addLineControl($shapeControls,lineID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic'); // ok, so maybe a line isn't a conic section
	$conicDiv.addClass('line');
	$conicDiv.attr('id','line'+lineID);

	var $controlDiv = $('<div/>');
	$controlDiv.addClass('conicControl');

	var $startDiv = $('<div/>');
	var $startTitle = $('<div/>');
	var $startXInput = $('<input/>');
	var $startYInput = $('<input/>');
	$startDiv.addClass('field');
	$startTitle.addClass('fieldTitle');
	$startTitle.text('start');
	$startXInput.addClass('fieldValue');
	$startXInput.addClass('startX');
	$startYInput.addClass('fieldValue');
	$startYInput.addClass('startY');
	$startXInput.attr('type','text');
	$startYInput.attr('type','text');
	$startXInput.attr('name','startX');
	$startYInput.attr('name','startY');
	$startDiv.append($startTitle);
	$startDiv.append($startXInput);
	$startDiv.append($startYInput);

	var $endDiv = $('<div/>');
	var $endTitle = $('<div/>');
	var $endXInput = $('<input/>');
	var $endYInput = $('<input/>');
	$endDiv.addClass('field');
	$endTitle.addClass('fieldTitle');
	$endTitle.text('end');
	$endXInput.addClass('fieldValue');
	$endXInput.addClass('endX');
	$endYInput.addClass('fieldValue');
	$endYInput.addClass('endY');
	$endXInput.attr('type','text');
	$endYInput.attr('type','text');
	$endXInput.attr('name','endX');
	$endYInput.attr('name','endY');
	$endDiv.append($endTitle);
	$endDiv.append($endXInput);
	$endDiv.append($endYInput);

	$controlDiv.append($startDiv);
	$controlDiv.append($endDiv);
	$controlDiv.append(colorControl());
	$conicDiv.append(titleBar('line'));
	$conicDiv.append($controlDiv);
	$conicDiv.hide();

	$shapeControls.prepend($conicDiv);
	$conicDiv.slideDown();

	return $conicDiv;
}

function addCircleControl($shapeControls,circleID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('circle');
	$conicDiv.attr('id','circle'+circleID);

	var $controlDiv = $('<div/>');
	$controlDiv.addClass('conicControl');

	var $centerDiv = $('<div/>');
	var $centerTitle = $('<div/>');
	var $circleXInput = $('<input/>');
	var $circleYInput = $('<input/>');
	$centerDiv.addClass('field');
	$centerTitle.addClass('fieldTitle');
	$centerTitle.text('center');
	$circleXInput.addClass('fieldValue');
	$circleXInput.addClass('circleX');
	$circleYInput.addClass('fieldValue');
	$circleYInput.addClass('circleY');
	$circleXInput.attr('type','text');
	$circleYInput.attr('type','text');
	$circleXInput.attr('name','circleX');
	$circleYInput.attr('name','circleY');
	$centerDiv.append($centerTitle);
	$centerDiv.append($circleXInput);
	$centerDiv.append($circleYInput);

	var $radiusDiv = $('<div/>');
	var $radiusTitle = $('<div/>');
	var $radiusInput = $('<input/>');
	$radiusDiv.addClass('field');
	$radiusTitle.addClass('fieldTitle');
	$radiusTitle.text('radius');
	$radiusInput.addClass('fieldValue');
	$radiusInput.addClass('radius');
	$radiusInput.attr('type','text');
	$radiusInput.attr('name','radius');
	$radiusDiv.append($radiusTitle);
	$radiusDiv.append($radiusInput);

	$controlDiv.append($centerDiv);
	$controlDiv.append($radiusDiv);
	$controlDiv.append(colorControl());
	$conicDiv.append(titleBar('circle'));
	$conicDiv.append($controlDiv);
	$conicDiv.hide();

	$shapeControls.prepend($conicDiv);
	$conicDiv.slideDown();

	return $conicDiv;
}

function addEllipseControl($shapeControls,ellipseID)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('ellipse');
	$conicDiv.attr('id','ellipse'+ellipseID);

	var $controlDiv = $('<div/>');
	$controlDiv.addClass('conicControl');

	var $centerDiv = $('<div/>');
	var $centerTitle = $('<div/>');
	var $ellipseXInput = $('<input/>');
	var $ellipseYInput = $('<input/>');
	$centerDiv.addClass('field');
	$centerTitle.addClass('fieldTitle');
	$centerTitle.text('center');
	$ellipseXInput.addClass('fieldValue');
	$ellipseXInput.addClass('ellipseX');
	$ellipseYInput.addClass('fieldValue');
	$ellipseYInput.addClass('ellipseY');
	$ellipseXInput.attr('type','text');
	$ellipseYInput.attr('type','text');
	$ellipseXInput.attr('name','ellipseX');
	$ellipseYInput.attr('name','ellipseY');
	$centerDiv.append($centerTitle);
	$centerDiv.append($ellipseXInput);
	$centerDiv.append($ellipseYInput);

	var $radiusDiv = $('<div/>');
	var $radiusTitle = $('<div/>');
	var $radiusXInput = $('<input/>');
	var $radiusYInput = $('<input/>');
	$radiusDiv.addClass('field');
	$radiusTitle.addClass('fieldTitle');
	$radiusTitle.text('radius');
	$radiusXInput.addClass('fieldValue');
	$radiusXInput.addClass('radiusX');
	$radiusYInput.addClass('fieldValue');
	$radiusYInput.addClass('radiusY');
	$radiusXInput.attr('type','text');
	$radiusYInput.attr('type','text');
	$radiusXInput.attr('name','radiusX');
	$radiusYInput.attr('name','radiusY');
	$radiusDiv.append($radiusTitle);
	$radiusDiv.append($radiusXInput);
	$radiusDiv.append($radiusYInput);

	$controlDiv.append($centerDiv);
	$controlDiv.append($radiusDiv);
	$controlDiv.append(colorControl());
	$conicDiv.append(titleBar('ellipse'));
	$conicDiv.append($controlDiv);
	$conicDiv.hide();

	$shapeControls.prepend($conicDiv);
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

function line(id,$lineControl)
{
	this.id = id;
	this.$lineControl = $lineControl;
	this.virgin = true;

	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.color = "rgba(0,0,0,0.75)";
}

line.prototype.delete = function()
{
	this.$lineControl.slideUp().remove();
}

line.prototype.allSet = function()
{
	if (!isNaN(this.startX) && !isNaN(this.startY) && !isNaN(this.endX) && !isNaN(this.endY))
		return true;
	else
		return false;
}

line.prototype.editing = function()
{
	if (!this.virgin && this.allSet())
		return true;
	else
		return false;
}

line.prototype.updateStartX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.startX = testNum;

	this.$lineControl.find('input.startX').val(this.startX);
}

line.prototype.updateStartY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.startY = testNum;

	this.$lineControl.find('input.startY').val(this.startY);
}

line.prototype.updateEndX = function(newX)
{
	var testNum = parseInt(newX);

	if (!isNaN(testNum))
		this.endX = testNum;

	this.$lineControl.find('input.endX').val(this.endX);
}

line.prototype.updateEndY = function(newY)
{
	var testNum = parseInt(newY);

	if (!isNaN(testNum))
		this.endY = testNum;

	this.$lineControl.find('input.endY').val(this.endY);
}

line.prototype.updateColor = function(newColor)
{
	this.color = newColor;
}

// Bresenham's line algorithm
line.prototype.draw = function()
{
	if ((this.startX != null) && (this.startY != null) && (this.endX != null) && (this.endY != null))
	{
		var startX = this.startX;
		var endX = this.endX;
		var startY = this.startY;
		var endY = this.endY;

		var steep = false;
		if (Math.abs(endY-startY) > Math.abs(endX-startX))
			steep = true;

		if (steep)
		{
			var temp = startX;
			startX = startY;
			startY = temp;

			temp = endX;
			endX = endY;
			endY = temp;
		}

		if (startX > endX)
		{
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

		for (var x=startX; x<=endX; x++)
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
	this.idPool = 0;
	this.lineList = [];

	this.curLine;
	this.editingLineStart = false;
	this.editingLineEnd = false;
}

lines.prototype.addLine = function($shapeControls)
{
	var newLineID = this.idPool++;

	var $newLineControl = addLineControl($shapeControls,newLineID);
	this.curLine = new line(newLineID,$newLineControl);
	this.lineList = this.lineList.concat(this.curLine);
}

lines.prototype.getLine = function(lineID)
{
	for (var i = 0; i<this.lineList.length; i++)
	{
		if (this.lineList[i].id == lineID)
			return this.lineList[i];
	}
}

lines.prototype.setCurLine = function(lineID)
{
	this.curLine = this.getLine(lineID);
}

lines.prototype.isCurLineStart = function(x,y)
{
	if ((x == this.curLine.startX) && (y == this.curLine.startY))
		return true;
	else
		return false;
}

lines.prototype.isCurLineEnd = function(x,y)
{
	if ((x == this.curLine.endX) && (y == this.curLine.endY))
		return true;
	else
		return false;
}

lines.prototype.stopEditing = function()
{
	if (this.curLine && this.curLine.allSet())
		this.curLine.virgin = false;

	this.curLine = null;
	this.editingLineCenter = false;
	this.editingLineRadius = false;
}

lines.prototype.deleteLine = function(lineID)
{
	for (var i = 0; i<this.lineList.length; i++)
	{
		if (this.lineList[i].id == lineID)
		{
			this.lineList[i].delete();
			this.lineList.splice(i,1);

			break;
		}
	}
}

lines.prototype.draw = function()
{
	$.each(this.lineList,function(index,line)
	{
		line.draw();
	});
}

function circle(id,$circleControl)
{
	this.id = id;
	this.$circleControl = $circleControl;
	this.virgin = true;

	this.centerX;
	this.centerY;
	this.radius;

	this.color = "rgba(0,0,0,0.75)";
	this.showCenter = false;
}

circle.prototype.delete = function()
{
	this.$circleControl.slideUp().remove();
}

circle.prototype.allSet = function()
{
	if (!isNaN(this.centerX) && !isNaN(this.centerY) && !isNaN(this.radius))
		return true;
	else
		return false;
}

circle.prototype.editing = function()
{
	if (!this.virgin && this.allSet())
		return true;
	else
		return false;
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

		if (this.showCenter)
			graph.plot(this.centerX,this.centerY);
	}
}

function circles()
{
	this.idPool = 0;
	this.circleList = [];

	this.curCircle;
	this.editingCircleCenter = false;
	this.editingCircleRadius = false;
}

circles.prototype.addCircle = function($shapeControls)
{
	var newCircleID = this.idPool++;

	var $newCircleControl = addCircleControl($shapeControls,newCircleID);
	this.curCircle = new circle(newCircleID,$newCircleControl);
	this.circleList = this.circleList.concat(this.curCircle);

	this.curCircle.showCenter = true;
}

circles.prototype.getCircle = function(circleID)
{
	for (var i = 0; i<this.circleList.length; i++)
	{
		if (this.circleList[i].id == circleID)
			return this.circleList[i];
	}
}

circles.prototype.setCurCircle = function(circleID)
{
	this.curCircle = this.getCircle(circleID);
	this.curCircle.showCenter = true;
}

circles.prototype.isCurCircleCenter = function(x,y)
{
	if ((x == this.curCircle.centerX) && (y == this.curCircle.centerY))
		return true;
	else
		return false;
}

circles.prototype.stopEditing = function()
{
	if (this.curCircle && this.curCircle.allSet())
	{
		this.curCircle.virgin = false;
		this.curCircle.showCenter = false;
	}

	this.curCircle = null;
	this.editingCircleCenter = false;
	this.editingCircleRadius = false;
}

circles.prototype.deleteCircle = function(circleID)
{
	for (var i = 0; i<this.circleList.length; i++)
	{
		if (this.circleList[i].id == circleID)
		{
			this.circleList[i].delete();
			this.circleList.splice(i,1);

			break;
		}
	}
}

circles.prototype.draw = function()
{
	$.each(this.circleList,function(index,circle)
	{
		circle.draw();
	});
}

function ellipse(id,$ellipseControl)
{
	this.id = id;
	this.$ellipseControl = $ellipseControl;
	this.virgin = true;

	this.centerX;
	this.centerY;
	this.radiusX;
	this.radiusY;

	this.color = "rgba(0,0,0,0.75)";
	this.showCenter = false;
}

ellipse.prototype.delete = function()
{
	this.$ellipseControl.slideUp().remove();
}

ellipse.prototype.allSet = function()
{
	if (!isNaN(this.centerX) && !isNaN(this.centerY) && !isNaN(this.radiusX) && !isNaN(this.radiusY))
		return true;
	else
		return false;
}

ellipse.prototype.editing = function()
{
	if (!this.virgin && this.allSet())
		return true;
	else
		return false;
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

	if (!isNaN(testNum))
		this.radiusX = testNum;

	this.$ellipseControl.find('input.radiusX').val(this.radiusX);
}

ellipse.prototype.updateRadiusY = function(newRadiusY)
{
	var testNum = Math.abs(parseInt(newRadiusY));

	if (!isNaN(testNum))
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

	if (x != 0)
		graph.plot(this.centerX-x,this.centerY+y,this.color);

	if (y != 0)
		graph.plot(this.centerX+x,this.centerY-y,this.color);

	if ((x != 0) && (y != 0))
		graph.plot(this.centerX-x,this.centerY-y,this.color);
}

// midpoint ellipse algorithm
ellipse.prototype.draw = function()
{
	if ((this.centerX != null) && (this.centerY != null) && (this.radiusX != null) && (this.radiusY != null))
	{
		var x = -this.radiusX;
		var y = 0;
		var twoASquare = 2 * (this.radiusX * this.radiusX);
		var twoBSquare = 2 * (this.radiusY * this.radiusY);
		var deltaX = (1 - (2 * this.radiusX)) * (this.radiusY * this.radiusY);
		var deltaY = this.radiusX * this.radiusX;
		var error = deltaX + deltaY;
		var errorDoubled;

		do
		{
			this.plotFourPoints(x,y);

			errorDoubled = 2 * error;

			if (errorDoubled >= deltaX)
			{
				x++;
				deltaX += twoBSquare;
				error += deltaX;
			}

			if (errorDoubled <= deltaY)
			{
				y++;
				deltaY += twoASquare;
				error += deltaY;
			}
		} while (x <= 0);

		// for flat ellipses with radiusX = 1
		while (y++ < this.radiusY)
		{
			graph.plot(this.centerX, (this.centerY + y)); // draw the tip of the ellipse
			graph.plot(this.centerX, (this.centerY - y));
		}

		if (this.showCenter)
			graph.plot(this.centerX,this.centerY);
	}
}

function ellipses()
{
	this.idPool = 0;
	this.ellipseList = [];

	this.curEllipse;
	this.editingEllipseCenter = false;
	this.editingEllipseRadius = false;
}

ellipses.prototype.addEllipse = function($shapeControls)
{
	var newEllipseID = this.idPool++;

	var $newEllipseControl = addEllipseControl($shapeControls,newEllipseID);
	this.curEllipse = new ellipse(newEllipseID,$newEllipseControl);
	this.ellipseList = this.ellipseList.concat(this.curEllipse);

	this.curEllipse.showCenter = true;
}

ellipses.prototype.getEllipse = function(ellipseID)
{
	for (var i = 0; i<this.ellipseList.length; i++)
	{
		if (this.ellipseList[i].id == ellipseID)
			return this.ellipseList[i];
	}
}

ellipses.prototype.setCurEllipse = function(ellipseID)
{
	this.curEllipse = this.getEllipse(ellipseID);
	this.curEllipse.showCenter = true;
}

ellipses.prototype.isCurEllipseCenter = function(x,y)
{
	if ((x == this.curEllipse.centerX) && (y == this.curEllipse.centerY))
		return true;
	else
		return false;
}

ellipses.prototype.stopEditing = function()
{
	if (this.curEllipse && this.curEllipse.allSet())
	{
		this.curEllipse.virgin = false;
		this.curEllipse.showCenter = false;
	}

	this.curEllipse = null;
	this.editingEllipseCenter = false;
	this.editingEllipseRadius = false;
}

ellipses.prototype.deleteEllipse = function(ellipseID)
{
	for (var i = 0; i<this.ellipseList.length; i++)
	{
		if (this.ellipseList[i].id == ellipseID)
		{
			this.ellipseList[i].delete();
			this.ellipseList.splice(i,1);

			break;
		}
	}
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
	lines.draw();
	circles.draw();
	ellipses.draw();
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane();
	lines = new lines();
	circles = new circles();
	ellipses = new ellipses();
	
	// resize controlPane to prevent lengthening of page
	var $controlPane = $('#controlPane');
	$controlPane.height(canvas.height);
	
	// add conic form to config div
	var $pageControls = $('<div/>');
	$pageControls.addClass('controls');
	$pageControls.append(graphControl());
	$pageControls.append(newConicControl());
	$controlPane.append($pageControls);

	// add div for shape controls
	var $shapeControls = $('<div/>');
	$shapeControls.addClass('shapeControls');
	$controlPane.append($shapeControls);
	$shapeControls.height($controlPane.height() - $pageControls.outerHeight(true));

	// display the initial graph
	setInterval(draw,100);

	$('div.newLine').click(function(event)
	{
		lines.stopEditing();
		circles.stopEditing();
		ellipses.stopEditing();

		lines.addLine($shapeControls);

		lines.curLine.$lineControl.addClass('selected');
		lines.curLine.$lineControl.siblings().removeClass('selected');

		canvas.cursorCrosshair();
	});

	$('div.newCircle').click(function(event)
	{
		lines.stopEditing();
		circles.stopEditing();
		ellipses.stopEditing();

		circles.addCircle($shapeControls);

		circles.curCircle.$circleControl.addClass('selected');
		circles.curCircle.$circleControl.siblings().removeClass('selected');

		canvas.cursorCrosshair();
	});

	$('div.newEllipse').click(function(event)
	{
		lines.stopEditing();
		circles.stopEditing();
		ellipses.stopEditing();

		ellipses.addEllipse($shapeControls);

		ellipses.curEllipse.$ellipseControl.addClass('selected');
		ellipses.curEllipse.$ellipseControl.siblings().removeClass('selected');

		canvas.cursorCrosshair();
	});

	// handle updates to line start X values
	$('input.startX').live('change',function()
	{
		var $startX = $(this);
		var lineID = $startX.closest('div.line').attr('id').replace('line','');

		lines.getLine(lineID).updateStartX($startX.val());
	});

	// handle updates to line start Y values
	$('input.startY').live('change',function()
	{
		var $startY = $(this);
		var lineID = $startY.closest('div.line').attr('id').replace('line','');

		lines.getLine(lineID).updateStartY($startY.val());
	});

	// handle updates to line end X values
	$('input.endX').live('change',function()
	{
		var $endX = $(this);
		var lineID = $endX.closest('div.line').attr('id').replace('line','');

		lines.getLine(lineID).updateEndX($endX.val());
	});

	// handle updates to line end Y values
	$('input.endY').live('change',function()
	{
		var $endY = $(this);
		var lineID = $endY.closest('div.line').attr('id').replace('line','');

		lines.getLine(lineID).updateEndY($endY.val());
	});

	// handle updates to circle center X values
	$('input.circleX').live('change',function()
	{
		var $circleX = $(this);
		var circleID = $circleX.closest('div.circle').attr('id').replace('circle','');

		circles.getCircle(circleID).updateCenterX($circleX.val());
	});

	// handle updates to circle center Y values
	$('input.circleY').live('change',function()
	{
		var $circleY = $(this);
		var circleID = $circleY.closest('div.circle').attr('id').replace('circle','');

		circles.getCircle(circleID).updateCenterY($circleY.val());
	});

	// handle updates to circle radius values
	$('input.radius').live('change',function()
	{
		var $radius = $(this);
		var circleID = $radius.closest('div.circle').attr('id').replace('circle','');

		circles.getCircle(circleID).updateRadius($radius.val());
	});

	// handle updates to ellipse center X values
	$('input.ellipseX').live('change',function()
	{
		var $ellipseX = $(this);
		var ellipseID = $ellipseX.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.getEllipse(ellipseID).updateCenterX($ellipseX.val());
	});

	// handle updates to ellipse center Y values
	$('input.ellipseY').live('change',function()
	{
		var $ellipseY = $(this);
		var ellipseID = $ellipseY.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.getEllipse(ellipseID).updateCenterY($ellipseY.val());
	});

	// handle updates to ellipse radius X values
	$('input.radiusX').live('change',function()
	{
		var $radiusX = $(this);
		var ellipseID = $radiusX.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.getEllipse(ellipseID).updateRadiusX($radiusX.val());
	});

	// handle updates to ellipse radius Y values
	$('input.radiusY').live('change',function()
	{
		var $radiusY = $(this);
		var ellipseID = $radiusY.closest('div.ellipse').attr('id').replace('ellipse','');

		ellipses.getEllipse(ellipseID).updateRadiusY($radiusY.val());
	});

	$('input.color').live('change',function()
	{
		var $conic = $(this).closest('div.conic');

		color = "rgba(";
		hex = "#";

		if ($($conic).find('input.red').is(':checked'))
		{
			color += "255,";
			hex += "FF";
		}
		else
		{
			color += "0,";
			hex += "00";
		}

		if ($($conic).find('input.green').is(':checked'))
		{
			color += "255,";
			hex += "FF";
		}
		else
		{
			color += "0,";
			hex += "00";
		}

		if ($($conic).find('input.blue').is(':checked'))
		{
			color += "255,";
			hex += "FF";
		}
		else
		{
			color += "0,";
			hex += "00";
		}

		color += "0.75)";

		$conic.find('input.hexColor').val(hex);

		if ($($conic).is('.line'))
		{
			var lineID = $conic.attr('id').replace('line','');

			lines.getLine(lineID).updateColor(color);
		}
		else if ($($conic).is('.circle'))
		{
			var circleID = $conic.attr('id').replace('circle','');

			circles.getCircle(circleID).updateColor(color);
		}
		else if ($($conic).is('.ellipse'))
		{
			var ellipseID = $conic.attr('id').replace('ellipse','');

			ellipses.getEllipse(ellipseID).updateColor(color);
		}
	});

	$('input.hexColor').live('change',function()
	{
		var $hexInput = $(this);
		var hexString = $hexInput.val();
		var $conic = $(this).closest('div.conic');

		if (hexString.charAt(0) == '#')
			hexString = hexString.substring(1,7);

		var redInt = parseInt(hexString.substring(0,2), 16);
		var greenInt = parseInt(hexString.substring(2,4), 16);
		var blueInt = parseInt(hexString.substring(4,6), 16);

		$conic.find('input.color').attr('checked',false);

		if (!isNaN(redInt) && !isNaN(greenInt) && !isNaN(blueInt))
		{
			var color = "rgba(" + redInt + "," + greenInt + "," + blueInt + ",0.75)";

			if ($($conic).is('.line'))
			{
				var lineID = $conic.attr('id').replace('line','');

				lines.getLine(lineID).updateColor(color);
			}
			else if ($($conic).is('.circle'))
			{
				var circleID = $conic.attr('id').replace('circle','');

				circles.getCircle(circleID).updateColor(color);
			}
			else if ($($conic).is('.ellipse'))
			{
				var ellipseID = $conic.attr('id').replace('ellipse','');

				ellipses.getEllipse(ellipseID).updateColor(color);
			}
		}
		else
		{
			$hexInput.val('');
		}
	});

	$('.title').live('click',function()
	{
		var $conic = $(this).closest('div.conic');
		var $conicControl = $conic.find('.conicControl');

		if ($($conic).is('.selected'))
		{
			$conic.removeClass('selected');

			lines.stopEditing();
			circles.stopEditing();
			ellipses.stopEditing();

			canvas.cursorOpenHand();
		}
		else if (!$($conicControl).is(':visible'))
		{
			$conic.find('.hide').text('[-]');
			$conicControl.slideDown();
		}
		else
		{
			$conic.addClass('selected');
			$conic.siblings().removeClass('selected');

			lines.stopEditing();
			circles.stopEditing();
			ellipses.stopEditing();

			if ($($conic).is('.line'))
			{
				var lineID = $conic.attr('id').replace('line','');

				lines.setCurLine(lineID);

				// if this line was never drawn in the first place
				if (!lines.curLine.editing())
					canvas.cursorCrosshair();
			}
			else if ($($conic).is('.circle'))
			{
				var circleID = $conic.attr('id').replace('circle','');

				circles.setCurCircle(circleID);

				// if this circle was never drawn in the first place
				if (!circles.curCircle.editing())
					canvas.cursorCrosshair();
			}
			else if ($($conic).is('.ellipse'))
			{
				var ellipseID = $conic.attr('id').replace('ellipse','');

				ellipses.setCurEllipse(ellipseID);

				// if this ellipse was never drawn in the first place
				if (!ellipses.curEllipse.editing())
					canvas.cursorCrosshair();
			}
		}
	});

	$('.close').live('click',function()
	{
		var $conic = $(this).closest('div.conic');

		if ($($conic).is('.line'))
		{
			var lineID = $conic.attr('id').replace('line','');

			if (lines.curLine && (lines.curLine.id == lineID))
			{
				lines.stopEditing();
				canvas.cursorOpenHand();
			}

			lines.deleteLine(lineID);
		}
		else if ($($conic).is('.circle'))
		{
			var circleID = $conic.attr('id').replace('circle','');

			if (circles.curCircle && (circles.curCircle.id == circleID))
			{
				circles.stopEditing();
				canvas.cursorOpenHand();
			}

			circles.deleteCircle(circleID);
		}
		else if ($($conic).is('.ellipse'))
		{
			var ellipseID = $conic.attr('id').replace('ellipse','');

			if (ellipses.curEllipse && (ellipses.curEllipse.id == ellipseID))
			{
				ellipses.stopEditing();
				canvas.cursorOpenHand();
			}

			ellipses.deleteEllipse(ellipseID);
		}
	});

	$('.hide').live('click',function()
	{
		var $hideIcon = $(this);
		var $conic = $(this).closest('div.conic');
		var $conicControl = $conic.find('.conicControl');

		if ($($conicControl).is(':visible'))
		{
			$hideIcon.text('[+]');
			$conicControl.slideUp();

			if ($($conic).is('.selected'))
			{
				$conic.removeClass('selected');
				$hideIcon.text('[+]');

				lines.stopEditing();
				circles.stopEditing();
				ellipses.stopEditing();

				canvas.cursorOpenHand();
			}
		}
		else
		{
			$hideIcon.text('[-]');
			$conicControl.slideDown();
		}
	});

	$('#canvas').mousedown(function(event)
	{
		clicking = true;

		var curX = graph.getX(canvas.getX(event.pageX));
		var curY = graph.getY(canvas.getY(event.pageY));

		if (lines.curLine)
		{
			if (lines.curLine.editing())
			{
				if (lines.isCurLineStart(curX,curY))
				{
					canvas.cursorClosedHand();
					lines.editingLineStart = true;
				}
				else if (lines.isCurLineEnd(curX,curY))
				{
					canvas.cursorClosedHand();
					lines.editingLineEnd = true;
				}
			}
			else
			{
				startX = curX;
				startY = curY;

				lines.curLine.updateStartX(curX);
				lines.curLine.updateStartY(curY);
				lines.curLine.updateEndX(curX);
				lines.curLine.updateEndY(curY);
			}
		}
		else if (circles.curCircle)
		{
			if (circles.curCircle.editing())
			{
				if (circles.isCurCircleCenter(curX,curY))
				{
					canvas.cursorClosedHand();
					circles.editingCircleCenter = true;
				}
				else
				{
					circles.editingCircleRadius = true;

					var deltaX = circles.curCircle.centerX - curX;
					var deltaY = circles.curCircle.centerY - curY;

					circles.curCircle.updateRadius(Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));
				}
			}
			else
			{
				startX = curX;
				startY = curY;

				circles.curCircle.updateCenterX(curX);
				circles.curCircle.updateCenterY(curY);
				circles.curCircle.updateRadius(0);
			}
		}
		else if (ellipses.curEllipse)
		{
			if (ellipses.curEllipse.editing())
			{
				if (ellipses.isCurEllipseCenter(curX,curY))
				{
					canvas.cursorClosedHand();
					ellipses.editingEllipseCenter = true;
				}
				else
				{
					ellipses.editingEllipseRadius = true;

					var deltaX = Math.abs(ellipses.curEllipse.centerX - curX);
					var deltaY = Math.abs(ellipses.curEllipse.centerY - curY);

					ellipses.curEllipse.updateRadiusX(deltaX);
					ellipses.curEllipse.updateRadiusY(deltaY);
				}
			}
			else
			{
				startX = curX;
				startY = curY;

				ellipses.curEllipse.updateCenterX(curX);
				ellipses.curEllipse.updateCenterY(curY);
				ellipses.curEllipse.updateRadiusX(0);
				ellipses.curEllipse.updateRadiusY(0);
			}
		}
		else // click and drag panning
		{
			canvas.cursorClosedHand();

			startX = canvas.getX(event.pageX);
			startY = canvas.getY(event.pageY);
		}
	});

	$('#canvas').mousemove(function(event)
	{
		if ((lines.curLine && lines.curLine.editing()) || (circles.curCircle && circles.curCircle.editing()) || (ellipses.curEllipse && ellipses.curEllipse.editing()))
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (lines.curLine)
			{
				if (lines.editingLineStart || lines.editingLineEnd)
					canvas.cursorClosedHand();
				else if (lines.isCurLineStart(curX,curY) || lines.isCurLineEnd(curX,curY))
					canvas.cursorOpenHand();
				else
					canvas.cursorDefault();
			}
			else if (circles.curCircle)
			{
				if (circles.editingCircleCenter)
					canvas.cursorClosedHand();
				else if (circles.isCurCircleCenter(curX,curY))
					canvas.cursorOpenHand();
				else
					canvas.cursorCrosshair();
			}
			else if (ellipses.curEllipse)
			{
				if (ellipses.editingEllipseCenter)
					canvas.cursorClosedHand();
				else if (ellipses.isCurEllipseCenter(curX,curY))
					canvas.cursorOpenHand();
				else
					canvas.cursorCrosshair();
			}
		}

		if (!clicking)
			return;

		if (lines.curLine)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (lines.curLine.editing())
			{
				if (lines.editingLineStart)
				{
					lines.curLine.updateStartX(curX);
					lines.curLine.updateStartY(curY);
				}
				else if (lines.editingLineEnd)
				{
					lines.curLine.updateEndX(curX);
					lines.curLine.updateEndY(curY);
				}
			}
			else
			{
				lines.curLine.updateEndX(curX);
				lines.curLine.updateEndY(curY);
			}
		}
		else if (circles.curCircle)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (circles.curCircle.editing())
			{
				if (circles.editingCircleCenter)
				{
					circles.curCircle.updateCenterX(curX);
					circles.curCircle.updateCenterY(curY);
				}
				else if (circles.editingCircleRadius)
				{
					var deltaX = circles.curCircle.centerX - curX;
					var deltaY = circles.curCircle.centerY - curY;

					circles.curCircle.updateRadius(Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));
				}
			}
			else
			{
				var deltaX = startX - curX;
				var deltaY = startY - curY;

				circles.curCircle.updateRadius(Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));
			}
		}
		else if (ellipses.curEllipse)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (ellipses.curEllipse.editing())
			{
				if (ellipses.editingEllipseCenter)
				{
					ellipses.curEllipse.updateCenterX(curX);
					ellipses.curEllipse.updateCenterY(curY);
				}
				else if (ellipses.editingEllipseRadius)
				{
					var deltaX = Math.abs(ellipses.curEllipse.centerX - curX);
					var deltaY = Math.abs(ellipses.curEllipse.centerY - curY);

					ellipses.curEllipse.updateRadiusX(deltaX);
					ellipses.curEllipse.updateRadiusY(deltaY);
				}
			}
			else
			{
				var deltaX = Math.abs(startX - curX);
				var deltaY = Math.abs(startY - curY);

				ellipses.curEllipse.updateRadiusX(deltaX);
				ellipses.curEllipse.updateRadiusY(deltaY);
			}
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

		if (lines.curLine)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (lines.curLine.editing())
			{
				if (lines.editingLineStart)
				{
					lines.curLine.updateStartX(curX);
					lines.curLine.updateStartY(curY);

					lines.editingLineStart = false;
				}
				else if (lines.editingLineEnd)
				{
					lines.curLine.updateEndX(curX);
					lines.curLine.updateEndY(curY);

					lines.editingLineEnd = false;
				}
			}
			else
			{
				lines.curLine.updateEndX(curX);
				lines.curLine.updateEndY(curY);

				lines.curLine.$lineControl.removeClass('selected');
				lines.stopEditing();
				canvas.cursorOpenHand();
			}
		}
		else if (circles.curCircle)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (circles.curCircle.editing())
			{
				if (circles.editingCircleCenter)
				{
					circles.curCircle.updateCenterX(curX);
					circles.curCircle.updateCenterY(curY);

					circles.editingCircleCenter = false;
				}
				else if (circles.editingCircleRadius)
				{
					var deltaX = circles.curCircle.centerX - curX;
					var deltaY = circles.curCircle.centerY - curY;

					circles.curCircle.updateRadius(Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));

					circles.editingCircleRadius = false;
				}
			}
			else
			{
				var deltaX = startX - curX;
				var deltaY = startY - curY;

				circles.curCircle.updateRadius(Math.sqrt((deltaX*deltaX) + (deltaY*deltaY)));

				circles.curCircle.$circleControl.removeClass('selected');
				circles.stopEditing();
				canvas.cursorOpenHand();
			}
		}
		else if (ellipses.curEllipse)
		{
			var curX = graph.getX(canvas.getX(event.pageX));
			var curY = graph.getY(canvas.getY(event.pageY));

			if (ellipses.curEllipse.editing())
			{
				if (ellipses.editingEllipseCenter)
				{
					ellipses.curEllipse.updateCenterX(curX);
					ellipses.curEllipse.updateCenterY(curY);

					ellipses.editingEllipseCenter = false;
				}
				else if (ellipses.editingEllipseRadius)
				{
					var deltaX = Math.abs(ellipses.curEllipse.centerX - curX);
					var deltaY = Math.abs(ellipses.curEllipse.centerY - curY);

					ellipses.curEllipse.updateRadiusX(deltaX);
					ellipses.curEllipse.updateRadiusY(deltaY);

					ellipses.editingEllipseRadius = false;
				}
			}
			else
			{
				var deltaX = Math.abs(startX - curX);
				var deltaY = Math.abs(startY - curY);

				ellipses.curEllipse.updateRadiusX(deltaX);
				ellipses.curEllipse.updateRadiusY(deltaY);

				ellipses.curEllipse.$ellipseControl.removeClass('selected');
				ellipses.stopEditing();
				canvas.cursorOpenHand();
			}
		}
		else // click and drag panning
		{
			var curX = canvas.getX(event.pageX);
			var curY = canvas.getY(event.pageY);

			graph.moveOriginX(curX - startX);
			graph.moveOriginY(curY - startY);

			canvas.cursorOpenHand();
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
