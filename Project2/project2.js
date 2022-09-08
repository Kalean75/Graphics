// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.

function GetTransform(positionX, positionY, rotation, scale) {
	/*
COLUMN MAJOR ORDER

1 0 0
0 1 0
0 0 1

{ x1, x2, tx }
{ y1, y2, ty }
{ 0,  0,  1  }

*/
	//Rotation
	/*Cos(Theta) -Sin(Theta)
	Sin(theta)   Cos(Theta)
	*/
/*
{ cos(rot)*x1, (-sin(rot))*x2, tx }
{ sin(rot)*y1, cos(rot)*y2,    ty }
{ 0,           0,              1  }
*/
	//translation
	//P'X = Px + tx
	//P'Y = Py + ty

	//uniform scale
	//P' = sP
	//Uniform scale
	var identityMatrix = Array(1, 0, 0, 0, 1, 0, 0, 0, 1);

	//rotation
	identityMatrix[0] = Math.cos(rotation*(3.14/180));
	identityMatrix[1] = Math.sin(rotation*(3.14/180));
	identityMatrix[4] = Math.cos(rotation*(3.14/180));
	identityMatrix[3] = -Math.sin(rotation*(3.14/180));
	//uniform scale
	for (var i = 0; i < identityMatrix.length; i++) 
	{
		identityMatrix[i] *= scale;
	}
	//X and y Translation
	identityMatrix[6] = positionX;
	identityMatrix[7] = positionY;
	return identityMatrix;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform(trans1, trans2) 
{
	/*
	------------------------------>   |
	array[0]	array[3]	array[6]  | array[0]	array[3]	array[6]
	array[1]	array[4]	array[7]  | array[1]	array[4]	array[7] 
	array[2]	array[5]	array[8]  v array[2]	array[5]	array[8]
	*/
	var transformationMatrix = Array(1, 0, 0, 0, 1, 0, 0, 0, 1);
	//first row of a
	transformationMatrix[0] = (transformationMatrix[0] * trans1[0]) + (transformationMatrix[3] * trans1[1])+(transformationMatrix[6] * trans1[2]);
	transformationMatrix[3] = (transformationMatrix[0] * trans1[3]) + (transformationMatrix[3] * trans1[4])+(transformationMatrix[6] * trans1[5]);
	transformationMatrix[6] = (transformationMatrix[0] * trans1[6]) + (transformationMatrix[3] * trans1[7])+(transformationMatrix[6] * trans1[8]);
	//second row of a
	transformationMatrix[1] = (transformationMatrix[1] * trans1[0]) + (transformationMatrix[4] * trans1[1])+(transformationMatrix[7] * trans1[2]);
	transformationMatrix[4] = (transformationMatrix[1] * trans1[3]) + (transformationMatrix[4] * trans1[4])+(transformationMatrix[7] * trans1[5]);
	transformationMatrix[7] = (transformationMatrix[1] * trans1[6]) + (transformationMatrix[4] * trans1[7])+(transformationMatrix[7] * trans1[8]);
	//third row of a
	transformationMatrix[2] = (transformationMatrix[2] * trans1[0]) + (transformationMatrix[5] * trans1[1])+(transformationMatrix[8] * trans1[2]);
	transformationMatrix[5] = (transformationMatrix[2] * trans1[3]) + (transformationMatrix[5] * trans1[4])+(transformationMatrix[8] * trans1[5]);
	transformationMatrix[8] = (transformationMatrix[2] * trans1[6]) + (transformationMatrix[5] * trans1[7])+(transformationMatrix[8] * trans1[8]);

	//first row of a
	transformationMatrix[0] = (transformationMatrix[0] * trans2[0]) + (transformationMatrix[3] * trans2[1])+(transformationMatrix[6] * trans2[2]);
	transformationMatrix[3] = (transformationMatrix[0] * trans2[3]) + (transformationMatrix[3] * trans2[4])+(transformationMatrix[6] * trans2[5]);
	transformationMatrix[6] = (transformationMatrix[0] * trans2[6]) + (transformationMatrix[3] * trans2[7])+(transformationMatrix[6] * trans2[8]);
	//second row of a
	transformationMatrix[1] = (transformationMatrix[1] * trans2[0]) + (transformationMatrix[4] * trans2[1])+(transformationMatrix[7] * trans2[2]);
	transformationMatrix[4] = (transformationMatrix[1] * trans2[3]) + (transformationMatrix[4] * trans2[4])+(transformationMatrix[7] * trans2[5]);
	transformationMatrix[7] = (transformationMatrix[1] * trans2[6]) + (transformationMatrix[4] * trans2[7])+(transformationMatrix[7] * trans2[8]);
	//third row of a
	transformationMatrix[2] = (transformationMatrix[2] * trans2[0]) + (transformationMatrix[5] * trans2[1])+(transformationMatrix[8] * trans2[2]);
	transformationMatrix[5] = (transformationMatrix[2] * trans2[3]) + (transformationMatrix[5] * trans2[4])+(transformationMatrix[8] * trans2[5]);
	transformationMatrix[8] = (transformationMatrix[2] * trans2[6]) + (transformationMatrix[5] * trans2[7])+(transformationMatrix[8] * trans2[8]);

	return transformationMatrix;
}
