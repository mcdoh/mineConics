$(document).ready(function()
{
	// get a reference to the canvas
	var ctx = $('#graph')[0].getContext('2d');

	ctx.beginPath();

	// draw "graph paper"
	for (var r=0; r<50; r++)
	{
		for (var c=0; c<50; c++)
		{
			ctx.fillStyle = "rgba(1,1,1, 0.1)";
			ctx.rect(r*10+1,c*10+1,9,9);
		}
	}

	ctx.closePath();
	ctx.fill();
});

