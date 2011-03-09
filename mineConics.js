function pass(radius,$debugList,passCtr,ctx,graphHeight,graphWidth,graphScale,passName)
{
	var conicSize = Math.ceil((radius+1)*2); // '+1' gives us some room around the shape once drawn

	var tempID = passCtr;
	var $pass = $('<li/>');
	var $passAnchor = $('<a/>');
	var $passList = $('<ul/>');

	tempID = 'pass' + passCtr;
	$pass.addClass('pass');
	$pass.attr('id',tempID);

	tempID = 'passAnchor' + passCtr;
	$passAnchor.addClass('pass');
	$passAnchor.attr('id',tempID);
	$passAnchor.text(passName);
	$passAnchor.attr('href',$passAnchor.text());

	tempID = 'passList' + passCtr;
	$passList.addClass('passList');
	$passList.attr('id',tempID);
	$passList.hide();

	$pass.append($passAnchor);
	$pass.append($passList);
	$debugList.append($pass);
	passCtr++;

	$passList.append('<li>Radius: ' + radius + '</li>');
	$passList.append('<li>Conic Size: ' + conicSize + '</li>');

	// draw "graph paper"
	for (var r=0; r<conicSize; r++)
	{
		var $debugRow = $('<li/>');
		$debugRow.text('Row: ' + r);
		$passList.append($debugRow);

		for (var c=0; c<conicSize; c++)
		{
			ctx.fillStyle = "rgba(1,1,1, 0.1)";
			ctx.rect(r*graphScale+1,c*graphScale+1,graphScale-1,graphScale-1);
		}
	}

}

$(document).ready(function()
{
	var radius = 7.5;
	var $debugList = $('#debugList');
	var passCtr = 0;

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

	pass(radius,$debugList,passCtr,ctx,graphHeight,graphWidth,graphScale,'Drawing Graph');

	ctx.closePath();
	ctx.fill();

	$('a.pass').live('click',function(event)
	{
		var $pass = $(this).parent();
		var $passList = $pass.find('ul.passList');

		event.preventDefault();

		$pass.siblings().find('ul.passList:visible').slideUp();
		$passList.slideToggle();
	});
});

