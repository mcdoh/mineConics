function addCircleControl($controlPane)
{
	var $conicForm = $('<form/>');
	$conicForm.addClass('conicForm');
	$conicForm.addClass('circleForm');

	var $diameterInput = $('<input/>');
	$diameterInput.addClass('conicInput');
	$diameterInput.addClass('diameterInput');
	$diameterInput.attr('type','text');
	$diameterInput.attr('name','diameter');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conicSubmit');
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
	$conicForm.addClass('conicForm');

	var $heightInput = $('<input/>');
	$heightInput.addClass('conicInput');
	$heightInput.addClass('heightInput');
	$heightInput.attr('type','text');
	$heightInput.attr('name','height');

	var $widthInput = $('<input/>');
	$widthInput.addClass('conicInput');
	$widthInput.addClass('widthInput');
	$widthInput.attr('type','text');
	$widthInput.attr('name','width');

	var $conicSubmit = $('<input/>');
	$conicSubmit.addClass('conicSubmit');
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

function circle(diameter,color)
{
	this.diameter = diameter;
	this.color = color;
}

circle.prototype.size = function()
{
	return this.diameter;
}

function ellipse(height,width,color)
{
	this.height = height;
	this.width = width;
	this.color = color;
}

ellipse.prototype.size = function()
{
	if (height >= width)
		return this.height;
	else
		return this.width;
}

function drawGraph(ctx,row,col,graphScale,x,y)
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

function drawCircle(ctx,row,col,graphScale,x,y,diameter,color)
{
	var radius = diameter / 2;
	var circleTest = Math.sqrt((x*x) + (y*y));

	if ((circleTest <= radius) && (circleTest > (radius-1)))
	{
		ctx.beginPath();

		ctx.fillStyle = color;
		ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
		ctx.closePath();
		ctx.fill();
	}
}

function drawEllipse(ctx,row,col,graphScale,x,y,height,width,color)
{
	var a = width;
	var b = height;
	var unit = 1;
	var perimiter = ((x*x)/(a*a) + (y*y)/(b*b));
	var inner = ((x*x)/((a-1)*(a-1)) + (y*y)/((b-1)*(b-1)));

	if ((inner <= unit) && (inner > unit))
	{
		ctx.beginPath();

		ctx.fillStyle = color;
		ctx.rect(col*graphScale+1,row*graphScale+1,graphScale-1,graphScale-1);
		
		ctx.closePath();
		ctx.fill();
	}
}

function draw(circles,ctx)
{
	var graphHeight = $('#graph').height();
	var graphWidth = $('#graph').width();
	var graphSize = 21; // minimum graph size

	// get largest shape
	$.each(circles,function(index,shape)
	{
		if ((shape.size()+2) > graphSize)
			graphSize = shape.size() + 2;
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

			drawGraph(ctx,row,col,graphScale,x,y);

			$.each(circles,function(index,element)
			{
				// adjust for drawing even circles
				if ((element.diameter % 2) == 0)
					drawCircle(ctx,row,col,graphScale,(x-0.5),(y+0.5),element.diameter,element.color);
				else
					drawCircle(ctx,row,col,graphScale,x,y,element.diameter,element.color);
			});
		}
	}
}

$(document).ready(function()
{
	var circles = [];

	// add conic form to config div
	var $controlPane = $('#controlPane');
	addCircleControl($controlPane);

	// get a reference to the canvas
	var ctx = $('#graph')[0].getContext('2d');

	// display the initial graph
	draw(circles,ctx);

	$('input.conicSubmit').live('click',function(event)
	{
		event.preventDefault();

		// clear all current circles
		circles.splice(0,circles.length);

		$('form.conicForm').each(function(index,conic)
		{
			var diameter = parseInt($(conic).find('input.conicInput').val());

			if (diameter)
				circles = circles.concat(new circle(diameter,"rgba(32,128,32,1)"));
		});

		draw(circles,ctx);

		addCircleControl($controlPane);
	});
});
