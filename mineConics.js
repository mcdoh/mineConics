$(document).ready(function()
{
	var radius = 7.5;
	var $debugList = $('#debugList');

	// get a reference to the canvas
	var ctx = $('#graph')[0].getContext('2d');

	var graphHeight = $('#graph').height();
	var graphWidth = $('#graph').width();

	var conicSize = Math.ceil((radius+1)*2); // '+1' gives us some room around the shape once drawn
	var conicScale = (graphHeight-1) / conicSize; // 'graphHeight-1' so we're not drawing right up to the border
	
	$debugList.append('<li>Graph Height: ' + graphHeight + '</li>');
	$debugList.append('<li>Graph Width: ' + graphWidth + '</li>');
	$debugList.append('<li>Radius: ' + radius + '</li>');
	$debugList.append('<li>Conic Size: ' + conicSize + '</li>');
	$debugList.append('<li>Conic Scale: ' + conicScale + '</li>');

	ctx.beginPath();

	var $pass = $('<li/>');
	var $passList = $('<ul/>');
	$pass.text('Drawing Graph');
	$pass.append($passList);
	$debugList.append($pass);

	// draw "graph paper"
	for (var r=0; r<conicSize; r++)
	{
		var $debugRow = $('<li/>');
		$debugRow.text('Row: ' + r);
		$passList.append($debugRow);

		for (var c=0; c<conicSize; c++)
		{
			ctx.fillStyle = "rgba(1,1,1, 0.1)";
			ctx.rect(r*conicScale+1,c*conicScale+1,conicScale-1,conicScale-1);
		}
	}

	ctx.closePath();
	ctx.fill();
});

