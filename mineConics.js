function drawGraph($rowList,ctx,row,col,graphScale,x,y,radius)
{
	ctx.beginPath();

	ctx.fillStyle = "rgba(1,1,1, 0.1)";
	ctx.rect(row*graphScale+1,col*graphScale+1,graphScale-1,graphScale-1);

	ctx.closePath();
	ctx.fill();

	// *** DEBUG STUFF *** //
	var $col = $('<li/>');
	var $colList = $('<ul/>');

	$col.text('Col ' + col);
	$col.append($colList);
	$rowList.append($col);

	$colList.append('<li>X: ' + x + '</li>');
	$colList.append('<li>Y: ' + y + '</li>');
	$colList.append('<li>Graph Scale: ' + graphScale + '</li>');
	// *** END DEBUG STUFF *** //
}

function drawCircle($rowList,ctx,row,col,graphScale,x,y,radius)
{
	circleTest = Math.sqrt((x*x) + (y*y));

	if ((circleTest <= radius) && (circleTest > (radius-1)))
	{
		ctx.beginPath();

		ctx.fillStyle = "rgba(0,1,0, 0.5)";
		ctx.rect(row*graphScale+1,col*graphScale+1,graphScale-1,graphScale-1);
		
		ctx.closePath();
		ctx.fill();

		// *** DEBUG STUFF *** //
		var $col = $('<li/>');
		var $colList = $('<ul/>');

		$col.text('Col ' + col);
		$col.append($colList);
		$rowList.append($col);

		$colList.append('<li>Inside</li>');
		$colList.append('<li>X: ' + x + '</li>');
		$colList.append('<li>Y: ' + y + '</li>');
		$colList.append('<li>Circle Test: ' + circleTest + '</li>');
		// *** END DEBUG STUFF *** //
	}
	else
	{
		// *** DEBUG STUFF *** //
		var $col = $('<li/>');
		var $colList = $('<ul/>');

		$col.text('Col ' + col);
		$col.append($colList);
		$rowList.append($col);

		$colList.append('<li>Outside</li>');
		$colList.append('<li>X: ' + x + '</li>');
		$colList.append('<li>Y: ' + y + '</li>');
		$colList.append('<li>Circle Test: ' + circleTest + '</li>');
		// *** END DEBUG STUFF *** //
	}
}

function draw(radius,$debugList,drawCtr,ctx,graphHeight,graphWidth,graphScale,drawName,drawFunc)
{
	var conicSize = Math.ceil((radius+1)*2); // '+1' gives us some room around the shape once drawn

	// *** DEBUG STUFF *** //
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

	$drawList.append('<li>Radius: ' + radius + '</li>');
	$drawList.append('<li>Conic Size: ' + conicSize + '</li>');
	// *** END DEBUG STUFF *** //

	// draw "graph paper"
	for (var row=0; row<conicSize; row++)
	{
		var x = Math.floor(row-radius);

		// *** DEBUG STUFF *** //
		var tempID = row;
		var $row = $('<li/>');
		var $rowAnchor = $('<a/>');
		var $rowList = $('<ul/>');

		tempID = 'row' + row;
		$row.addClass('row');
		$row.attr('id',tempID);

		tempID = 'rowAnchor' + row;
		$rowAnchor.addClass('row');
		$rowAnchor.attr('id',tempID);
		$rowAnchor.text('row ' + row);
		$rowAnchor.attr('href',$rowAnchor.text());

		tempID = 'rowList' + row;
		$rowList.addClass('rowList');
		$rowList.attr('id',tempID);
		$rowList.hide();

		$row.append($rowAnchor);
		$row.append($rowList);
		$drawList.append($row);
		// *** END DEBUG STUFF *** //

		for (var col=0; col<conicSize; col++)
		{
			var y = Math.floor(col-radius);

			drawFunc($rowList,ctx,row,col,graphScale,x,y,radius);
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

	draw(radius,$debugList,drawCtr,ctx,graphHeight,graphWidth,graphScale,'Drawing Graph',drawGraph);
	drawCtr++;

	draw(radius,$debugList,drawCtr,ctx,graphHeight,graphWidth,graphScale,'Drawing Circle',drawCircle);
	drawCtr++;

	$('a.draw').live('click',function(event)
	{
		var $draw = $(this).parent();
		var $drawList = $draw.find('ul.drawList');

		event.preventDefault();

		$draw.siblings().find('ul.drawList:visible').slideUp();
		$drawList.slideToggle();
	});

	$('a.row').live('click',function(event)
	{
		var $row = $(this).parent();
		var $rowList = $row.find('ul.rowList');

		event.preventDefault();

		$row.siblings().find('ul.rowList:visible').slideUp();
		$rowList.slideToggle();
	});
});

