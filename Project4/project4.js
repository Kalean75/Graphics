//project 4 Cs 4600
//Devin White
//u0775759

// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	// [TO-DO] Modify the code below to form the transformation matrix.
	var rotX = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), Math.sin(rotationX), 0,
		0, -Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];
	var rotY = [
		Math.cos(rotationY), 0, Math.sin(rotationY), 0,
		0, 1, 0, 0,
		-Math.sin(rotationY), 0, Math.cos(rotationY), 0,
		0, 0, 0, 1
	];
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotMatrix = MatrixMult(rotX, rotY);
	rotMatrix = MatrixMult(trans, rotMatrix);
	var mvp = MatrixMult(projectionMatrix, rotMatrix);
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		// [TO-DO] initializations
		// Compile the shader program
		this.prog = InitShaderProgram(MeshVS, MeshFS);
		this.texture = gl.createTexture();
		//this.texture2 = gl.createTexture();
		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.sampler = gl.getUniformLocation(this.prog, 'sampler')
		// Get the ids of the vertex attributes and tex coordinates in the shaders
		this.vertPos = gl.getAttribLocation(this.prog, 'pos');
		this.texCoords = gl.getAttribLocation(this.prog, 'txc');
		// Create the buffer objects
		this.vertbuffer = gl.createBuffer();
		this.texCoordbuffer = gl.createBuffer();

		//initial color
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
		
		//handle WebGL related initializations for rendering
	}


	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh(vertPos, texCoords) {
		// [TO-DO] Update the contents of the vertex buffer objects.
		//Vertex
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		//texture
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		this.numTriangles = vertPos.length / 3;
	}

	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ(swap) {
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
		if (swap) {

		}
		else {

		}
	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);
		gl.uniformMatrix4fv(this.mvp, false, trans);
		//draw model
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);
		//Texture buffer
		//gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
		//gl.vertexAttribPointer(this.texCoords, 2, gl.FLOAT, false, 0, 0);
		//gl.enableVertexAttribArray(this.texCoords);
		//draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) 
	{
		gl.useProgram(this.prog);
		//Bind the texture
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.sampler, 1);
		// You can set the texture image data using the following command.
		this.img = img; 
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
		// Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		this.showTexture(true);
	}

	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture(show) {
		// set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		if (show) {
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(this.sampler, 1);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.img);
			//Texture buffer
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
			gl.vertexAttribPointer(this.texCoords, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.texCoords);
		}
		else 
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(this.sampler, 0);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
				new Uint8Array([255, 0, 0, 255]));
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
			gl.vertexAttribPointer(this.texCoords, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.texCoords);
		}
	}
}
var MeshVS = `
	attribute vec3 pos;
	attribute vec2 txc;
	uniform mat4 mvp;
	varying vec2 texCoords;
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
		texCoords=txc;
	}
`;
// Fragment shader source code
//gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
var MeshFS = `
	precision mediump float;
	varying vec2 texCoords;
	uniform sampler2D tex;
	void main()
	{
		gl_FragColor = texture2D(tex,texCoords);
	}
`;
