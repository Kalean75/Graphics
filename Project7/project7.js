// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
		// [TO-DO] Modify the code below to form the transformation matrix.
		var rotX = [
			1, 0, 0, 0,
			0, Math.cos(rotationX), Math.sin(rotationX), 0,
			0, -Math.sin(rotationX), Math.cos(rotationX), 0,
			0, 0, 0, 1
		];
		var rotY = [
			Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
			0, 1, 0, 0,
			Math.sin(rotationY), 0, Math.cos(rotationY), 0,
			0, 0, 0, 1
		];
		var trans = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			translationX, translationY, translationZ, 1
		];
		var rotMatrix = MatrixMult(rotX, rotY);
		var mv = MatrixMult(trans, rotMatrix);
	//var mv = trans;
	return mv;
} 

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// initializations
		// Compile the shader program
		this.swap = false;
		this.prog = InitShaderProgram(MeshVS, MeshFS);
		this.texture = gl.createTexture();
		//this.texture2 = gl.createTexture();
		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		//texture sampler
		this.sampler = gl.getUniformLocation(this.prog, 'sampler');
		//normals
		this.normalMatrix = gl.getUniformLocation(this.prog, 'normalMatrix');
		//model view
		this.mv = gl.getUniformLocation(this.prog, 'mv');
		//show texture
		this.showTex = gl.getUniformLocation(this.prog, 'textureShown');
		//light direction
		this.lightDir= gl.getUniformLocation(this.prog, 'lightDirection');
		//shininess
		this.shininess = gl.getUniformLocation(this.prog, 'shininess');
		// Get the ids of the vertex attributes tex coordinates and normals in the shaders
		this.vertPos = gl.getAttribLocation(this.prog, 'pos');
		this.texCoords = gl.getAttribLocation(this.prog, 'txc');
		this.norm = gl.getAttribLocation(this.prog, 'norm');
		// Create the buffer objects
		this.vertbuffer = gl.createBuffer();
		this.texCoordbuffer = gl.createBuffer();
		this.normbuffer = gl.createBuffer();
		
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions,
	// an array of 2D texture coordinates, and an array of vertex normals.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex and every three consecutive 
	// elements in the normals array form a vertex normal.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords, normals )
	{
		// Update the contents of the vertex buffer objects.
		//Vertex
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		//texture
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		//normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		this.numTriangles = vertPos.length / 3;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ(swap)
	{
		gl.useProgram(this.prog);
		// Set the uniform parameter(s) of the vertex shader
		this.swap = swap;
		var trans2 = 
		[
			1,0,0,0,
			0,0,1,0,
			0,1,0,0,
			0,0,0,1

		];
		if (swap) 
		{
			// Swap Axis
			gl.uniformMatrix4fv(this.mvp, false, MatrixMult(this.trans,trans2));
			gl.uniformMatrix3fv(this.normalMatrix, false, this.matrixNormal);
			gl.uniformMatrix4fv(this.mv, false, this.matrixMV);
		}
		else
		{
			//Keep Axis
			gl.uniformMatrix4fv(this.mvp, false, this.trans);
			gl.uniformMatrix3fv(this.normalMatrix, false, this.matrixNormal);
			gl.uniformMatrix4fv(this.mv, false, this.matrixMV);
		}
	}
	
	// This method is called to draw the triangular mesh.
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw( matrixMVP, matrixMV, matrixNormal )
	{
		// Complete the WebGL initializations before drawing
		gl.useProgram(this.prog);
		//this.normal = MatrixMult(matrixMV,matrixNormal);
		//p'=Mp
		//n'= M

		this.trans = matrixMVP;

		this.matrixNormal = matrixNormal;
		//0 3 6
		//1 4 7
		//2 5 8
		this.matrixMV = matrixMV;
		this.swapYZ(this.swap);
		gl.clear(gl.COLOR_BUFFER_BIT);
		//draw model
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);
		//Texture buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordbuffer);
		gl.vertexAttribPointer(this.texCoords, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoords);
		//normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normbuffer);
		gl.vertexAttribPointer(this.norm, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.norm);
		//draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img)
	{
		//Bind the texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		// You can set the texture image data using the following command.
		this.img = img; 
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
		gl.uniform1i(this.sampler, 1);
		// Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		//pass in if button is toggled or not when texture initialized
		if(this.texButton == null)
		{
			this.showTexture(true);
		}
		else
		{
			this.showTexture(this.texButton);
		}
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		this.texButton = show;
		// set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTex, show);
	}
	
	// This method is called to set the incoming light direction
	setLightDir( x, y, z )
	{
		gl.useProgram(this.prog);
		//set the uniform parameter(s) of the fragment shader to specify the light direction.
		gl.uniform3fv(this.lightDir, new Float32Array([x,y,z]));
	}
	
	// This method is called to set the shininess of the material
	setShininess( shininess )
	{
		gl.useProgram(this.prog);
		// set the uniform parameter(s) of the fragment shader to specify the shininess.
		gl.uniform1f(this.shininess,shininess);
	}
}

// This function is called for every step of the simulation.
// Its job is to advance the simulation for the given time step duration dt.
// It updates the given positions and velocities.
function SimTimeStep( dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution )
{
	//Fs=k(l-l_rest)*d
	// l = |x1-x0|
	// d = (x1-x0)/l
	//position x
	//velocity v
	//initialize f = {0,0,0,....}
	var forces = Array( positions.length ).fill(new Vec3(0,0,0)); // The total for per particle
	//The arrays of positions and velocities contain one 3D vector object of JavaScript class Vec3 per mass particle. 
	// [TO-DO] Compute the total force of each particle
	//f = {f0,f1,f2,....,fn-1}
	//initialize f = {0,0,0,....}
	//for each particle i
	for(var i = 0; i < forces.length; i++)
	{
		//add gravity fi = fi+mi+g
		forces[i] = forces[i].add(gravity).mul(particleMass);
	}
	//for each spring between particles i and j
	for(var i = 0; i < springs.length; i++)
	{
		//compute spring forces fs and fd
		var rest = springs[i].rest;
		//stretch
		var l = Math.abs(positions[springs[i].p1].sub(positions[springs[i].p0]).len());
		//spring dir
		var d = positions[springs[i].p1].sub(positions[springs[i].p0]).div(l);
		//lenchange speed
		var ldot = velocities[springs[i].p1].sub(velocities[springs[i].p0]).dot(d);
		//Fs=k(l-l_rest)*d
		var Fs = d.mul(stiffness * (l - rest));
		//Fd = kld
		var Fd = d.mul(damping*ldot);
		//add spring force
		//fi = fi + (fs+fd)
		forces[springs[i].p0] = forces[springs[i].p0].add(Fs).add(Fd);
		//fj = fj - (fs+fd)
		forces[springs[i].p1] = forces[springs[i].p1].sub(Fs).add(Fd);
	}
	// [TO-DO] Update positions and velocities
	for(var i = 0; i < positions.length; i++)
	{
		var ai = forces[i].div(particleMass);
	//update position
	//xi = xi + deltatvi
	//update velocity
	//vi = vi+deltat*ai
	velocities[i] = ai.mul(dt).add(velocities[i]);
	positions[i] = velocities[i].mul(dt).add(positions[i]);
	}
	// [TO-DO] Handle collisions
	//h = xz - z0
	//h' = rh r = resitution coefficient
	// V'z = -rVz
}
//C = I(n*w) * Kd
// Vertex shader source code
//P'=Mp
//n'=Mtn
var MeshVS = `
	attribute vec3 pos;
	attribute vec2 txc;
	attribute vec3 norm;

	uniform mat4 mvp;
	uniform mat4 mv;
	uniform mat3 normalMatrix;

	varying vec2 texCoords;
	varying vec3 normalPos;
	varying vec3 viewPos;

	void main()
	{
		texCoords=txc;
		normalPos = vec3(normalMatrix * norm);
		vec4 vertPos4 = mv * vec4(pos, 1.0);
		viewPos = vec3(vertPos4)/ vertPos4.w;
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader source code;
//ks specular reflection constant light color(white)
//kd diffuse constant Material color
//ka ambient reflection constant
//alpha, shininess
//h angle between light dir and view dir
// h  normalize(view + lightDir);
//phi angle between normal and half angle
//cos phi = dot(n, h)
//cost(theta) = normal*lightDir
// C = I(dot(n,lightDir)Kd+Ks*dot(n,h)^shininess) + ambientLight*Kd
//c = Itheta(Kd+Ks(pih/theta))
var MeshFS = `
	precision mediump float;
	varying vec2 texCoords;
	varying vec3 normalPos;
	varying vec3 viewPos;
	uniform vec3 lightDirection;

	uniform sampler2D tex;
	uniform bool textureShown;
	uniform float shininess;

	void main()
	{
		
		vec3 v = -normalize(viewPos);
		vec3 n = normalize(normalPos);
		vec3 l = lightDirection;
		vec3 h = normalize(l + v);
		vec4 Ks = vec4(1.0,1.0,1.0,1.0);
		vec4 I = vec4(1.0,1.0,1.0,1.0);
		float theta = max(dot(l,n), 0.0);
		float phi = pow(max(dot(n,h),0.0), shininess);
		if(textureShown == true)
		{
			vec4 Kd = texture2D(tex, texCoords);
			vec4 ambient = vec4(vec3(0.2,0.2,0.2) * Kd.rgb,1.0);
			vec4 specular = vec4(Ks.rgb* phi,1.0);
			gl_FragColor = I* (Kd*theta+specular) + ambient;
		}
		else
		{
			 vec4 Kd = vec4(1.0,1.0,1.0,1.0);
			 vec4 ambient = vec4(vec3(0.2,0.2,0.2) * Kd.rgb,1.0);
			 vec4 specular = vec4(Ks.rgb* phi,1.0);
			 gl_FragColor = I* (Kd*theta+specular) + ambient;
		}
	}
`;