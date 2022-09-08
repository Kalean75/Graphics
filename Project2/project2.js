// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
		/*
	COLUMN MAJOR ORDER

	1 0 0
	0 1 0
	0 0 1

	*/
	//Rotation
	/*Cos(Theta) -Sin(Theta)
	Sin(theta)   Cos(Theta)
	*/

	//translation
	//P'X = Px + tx
	//P'Y = Py + ty

	//uniform scale
	//P' = sP
	//Uniform scale
	var identityMatrix = Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
	//uniform scale
	for(var i = 0; i < identityMatrix.length; i++)
	{
		identityMatrix[i] *= scale;
		alert(identityMatrix[i]);
	}
	var pX = positionX * Math.sin(rotation) + positionX * Math.cos(rotation);
	var pY = positionY * -Math.sin(rotation) + positionY * Math.cos(rotation);
	for(var i = 0; i< identityMatrix.length; i++)
	{
	
	}

	return identityMatrix;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	return Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
}
