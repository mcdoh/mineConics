function circle(diameter,color)
{
	this.diameter = diameter;
	this.color = color;
}

function drawGraph(ctx,row,col,graphScale,x,y)
{
	ctx.beginPath();

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

function draw(circles,ctx)
{
	var graphHeight = $('#graph').height();
	var graphWidth = $('#graph').width();
	var graphSize = 10; // for rendering multiple conics

	if (circles.length)
		graphSize = circles[0].diameter;

	$.each(circles,function(index,shape)
	{
		if ((shape.diameter+2) > graphSize)
			graphSize = shape.diameter + 2;
	});

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
				drawCircle(ctx,row,col,graphScale,x,y,element.diameter,element.color);
			});
		}
	}
}

$(document).ready(function()
{
	var circles = [];

	// get a reference to the canvas
	var ctx = $('#graph')[0].getContext('2d');

	// display the initial graph
	draw(circles,ctx);

	$('input.circleSubmit').live('click',function(event)
	{
		// grab the diameter value from the form
		diameter = parseInt($('input.circleDiameter').val());

		// clear all current circles
		circles.splice(0,circles.length);

		if (diameter)
		{
			circles = circles.concat(new circle(diameter,"rgba(32,128,32, 1)"));
		}

		event.preventDefault();

		draw(circles,ctx);
	});
});
