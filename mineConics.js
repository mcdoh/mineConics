function drawGraph(ctx,r,c,graphScale)
{
	ctx.fillStyle = "rgba(1,1,1, 0.1)";
	ctx.rect(r*graphScale+1,c*graphScale+1,graphScale-1,graphScale-1);
}

function draw(radius,$debugList,drawCtr,ctx,graphHeight,graphWidth,graphScale,drawName,drawFunc)
{
	var conicSize = Math.ceil((radius+1)*2); // '+1' gives us some room around the shape once drawn

	var tempID = drawCtr;
	var $draw = $('<li/>');
	var $drawAnchor = $('<a/>');
	var $drawList = $('<ul/>');

	tempID = 'draw' + drawCtr;
	$draw.addClass('draw');
	$draw.attr('id',tempID);

	tempID = 'drawAnchor' + drawCtr;
	$drawAnchor.addClass('draw');
	$drawAnchor.attr('id',tempID);
	$drawAnchor.text(drawName);
	$drawAnchor.attr('href',$drawAnchor.text());

	tempID = 'drawList' + drawCtr;
	$drawList.addClass('drawList');
	$drawList.attr('id',tempID);
	$drawList.hide();

	$draw.append($drawAnchor);
	$draw.append($drawList);
	$debugList.append($draw);
	drawCtr++;

	$drawList.append('<li>Radius: ' + radius + '</li>');
	$drawList.append('<li>Conic Size: ' + conicSize + '</li>');

	// draw "graph paper"
	for (var r=0; r<conicSize; r++)
	{
		var $debugRow = $('<li/>');
		$debugRow.text('Row: ' + r);
		$drawList.append($debugRow);

		for (var c=0; c<conicSize; c++)
		{
			drawFunc(ctx,r,c,graphScale);
		}
	}

}

$(document).ready(function()
{
	var radius = 7.5;
	var $debugList = $('#debugList');
	var drawCtr = 0;

	// get a reference to the canvas
	var ctx = $('#graph')[0].getContext('2d');

	var graphHeight = $('#graph').height();
	var graphWidth = $('#graph').width();

	var maxConicSize = Math.ceil((radius+1)*2); // for rendering multiple conics
	var graphScale = (graphHeight-1) / maxConicSize; // 'graphHeight-1' so we're not drawing right up to the border
	
	$debugList.append('<li>Graph Height: ' + graphHeight + '</li>');
	$debugList.append('<li>Graph Width: ' + graphWidth + '</li>');
	$debugList.append('<li>Graph Scale: ' + graphScale + '</li>');

	ctx.beginPath();

	draw(radius,$debugList,drawCtr,ctx,graphHeight,graphWidth,graphScale,'Drawing Graph',drawGraph);

	ctx.closePath();
	ctx.fill();

	$('a.draw').live('click',function(event)
	{
		var $draw = $(this).parent();
		var $drawList = $draw.find('ul.drawList');

		event.preventDefault();

		$draw.siblings().find('ul.drawList:visible').slideUp();
		$drawList.slideToggle();
	});
});

