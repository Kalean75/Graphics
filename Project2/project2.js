//Devin White
//U0775759
// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform(positionX, positionY, rotation, scale) {
	/*
	COLUMN MAJOR ORDER
	array[0](X1)	array[3](X2)	array[6](tX)  
	array[1](Y1)	array[4](Y2)	array[7](tY)  
	array[2](0)		array[5](0)		array[8](1) 
	*/

	var identityMatrix = Array(1, 0, 0, 0, 1, 0, 0, 0, 1);

	/*
	uniform scale
	P' = sP
	*/
	for (var i = 0; i < identityMatrix.length; i++) 
	{
		identityMatrix[i] *= scale;
	}
	
	/*
	Rotation	
	{ cos(rot)*x1   (-sin(rot))*y2  tx }
	{ sin(rot)*x1   cos(rot)*y2     ty }
	{ 	  0             0           1  }
	*/
	identityMatrix[1] = Math.sin(rotation*(Math.PI/180)) * identityMatrix[0];
	identityMatrix[3] = -Math.sin(rotation*(Math.PI/180)) * identityMatrix[4];
	identityMatrix[0] *= Math.cos(rotation*(Math.PI/180));
	identityMatrix[4] *= Math.cos(rotation*(Math.PI/180));

	/*
	X and y Translation
	P'X = Px + tx
	P'Y = Py + ty
	*/
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
								Multiplication
	------------------------------>  		|
	array[0]	array[3]	array[6]  		| array[0]	array[3]	array[6]
	array[1]	array[4]	array[7]  		| array[1]	array[4]	array[7] 
	array[2]	array[5]	array[8]  		v array[2]	array[5]	array[8]
	*/

	var newMatrix = new Array(9);

	//Apply transformations
	//first row of new Matrix
	newMatrix[0] = (trans1[0] * trans2[0]) + (trans1[1] * trans2[3])+(trans1[2] * trans2[6]);
	newMatrix[3] = (trans1[3] * trans2[0]) + (trans1[4] * trans2[3])+(trans1[5] * trans2[6]);
	newMatrix[6] = (trans1[6] * trans2[0]) + (trans1[7] * trans2[3])+(trans1[8] * trans2[6]);
	//second row of new Matrix
	newMatrix[1] = (trans1[0] * trans2[1]) + (trans1[1] * trans2[4])+(trans1[2] * trans2[7]);
	newMatrix[4] = (trans1[3] * trans2[1]) + (trans1[4] * trans2[4])+(trans1[5] * trans2[7]);
	newMatrix[7] = (trans1[6] * trans2[1]) + (trans1[7] * trans2[4])+(trans1[8] * trans2[7]);
	//third row of new Matrix
	newMatrix[2] = (trans1[0] * trans2[2]) + (trans1[1] * trans2[5])+(trans1[2] * trans2[8]);
	newMatrix[5] = (trans1[3] * trans2[2]) + (trans1[4] * trans2[5])+(trans1[5] * trans2[8]);
	newMatrix[8] = (trans1[6] * trans2[2]) + (trans1[7] * trans2[5])+(trans1[8] * trans2[8]);

	return newMatrix;
}
