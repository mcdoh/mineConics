var canvas;
var graph;

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

	$diameterDiv.text('Diameter');
	$diameterDiv.append($diameterInput);
	$conicForm.append($diameterDiv);
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

cartesianPlane.prototype.draw = function(row,col,graphScale,x,y)
{
	canvas.context.beginPath();

	canvas.context.fillStyle = this.color;
	canvas.context.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);

	if (((x==0) && ((y%2)==0)) || ((y==0) && ((x%2)==0)))
	{
		canvas.context.fillStyle = this.highlight;
		canvas.context.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
	}

	canvas.context.closePath();
	canvas.context.fill();
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

circle.prototype.draw = function(row,col,graphScale,x,y)
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
		canvas.context.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
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

ellipse.prototype.getSize = function()
{
	if (this.height >= this.width)
		return this.height;
	else
		return this.width;
}

ellipse.prototype.draw = function(row,col,graphScale,x,y)
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
		canvas.context.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
		canvas.context.closePath();
		canvas.context.fill();
	}
}

function draw()
{
	var graphSize = graph.getSize();
	var $conics = $('form.conic');
	var conics = [];

	$($conics).each(function(index,$conic)
	{
		if ($($conic).is('.circle'))
		{
			var diameter = parseInt($($conic).find('input.diameter').val());

			if (diameter)
			{
				conics = conics.concat(new circle(diameter,"rgba(32,128,32,1)"));

				if ((diameter+2) > graphSize)
					graphSize = diameter + 2;
			}
		}
		else if ($($conic).is('.ellipse'))
		{
			var height = parseInt($($conic).find('input.height').val());
			var width = parseInt($($conic).find('input.width').val());

			if (height && width)
			{
				conics = conics.concat(new ellipse(height,width,"rgba(32,128,32,1)"));

				if ((height+2) > graphSize)
					graphSize = height + 2;

				if ((width+2) > graphSize)
					graphSize = width + 2;
			}
		}
	});

	// ensure graph is of odd dimensions
	if ((graphSize%2) == 0)
		graphSize += 1;

	var graphScale;
	var xScale = (canvas.width()-1) / graphSize; // 'graph width - 1' so we're not drawing right up to the border
	var yScale = (canvas.height()-1) / graphSize; // 'graph height - 1' so we're not drawing right up to the border

	if (xScale <= yScale)
		graphScale = xScale;
	else
		graphScale = yScale;

	var xSize = parseInt(canvas.width() / graphScale);
	var ySize = parseInt(canvas.height() / graphScale);

	// ensure graph is of odd dimensions
	if ((xSize%2) == 0)
		xSize += 1;

	// ensure graph is of odd dimensions
	if ((ySize%2) == 0)
		ySize += 1;

	canvas.context.clearRect(0,0,canvas.width(),canvas.height());

	for (var row=0; row<ySize; row++)
	{
		var y = row - ((ySize-1) / 2);

		for (var col=0; col<xSize; col++)
		{
			var x = col - ((xSize-1) / 2);

			graph.draw(row,col,graphScale,x,y);

			$.each(conics,function(index,conic)
			{
				conic.draw(row,col,graphScale,x,y);
			});
		}
	}
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane(21,21,"rgba(1,1,1,.1)","rgba(1,1,1,.2)");

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
	setInterval(draw,10);

	$('input.newCircle').live('click',function(event)
	{
		addCircleControl($controlPane);
	});

	$('input.newEllipse').live('click',function(event)
	{
		addEllipseControl($controlPane);
	});
});
