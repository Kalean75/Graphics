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


// [TO-DO] Complete the implementation of the following class.

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
		this.normals = gl.getUniformLocation(this.prog, 'normals');
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
		// [TO-DO] Update the contents of the vertex buffer objects.
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
		//this.numTriangles = vertPos.length / 3;
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
			gl.uniformMatrix4fv(this.normals, false, this.matrixNormal);
			gl.uniformMatrix4fv(this.mv, false, this.matrixNormal);
		}
		else
		{
			//Keep Axis
			gl.uniformMatrix4fv(this.mvp, false, this.trans);
			gl.uniformMatrix4fv(this.normals, false, this.matrixMV);
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
		gl.vertexAttribPointer(this.norm, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.norm);
		//draw triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}
	
	// This method is called to set the texture of the mesh.
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
		//Blinn C=I(cosTHETAKd+Ks(cos(shininess)^alpha))
		gl.uniform1i(this.shininess,shininess);
	}
}
//		C = I(n*w) * Kd
// Vertex shader source code
//P'=Mp
//n'=Mtn
var MeshVS = `
	attribute vec3 pos;
	attribute vec2 txc;
	attribute vec3 norm;

	uniform mat4 mvp;
	uniform mat4 mv;
	uniform mat4 normals;
	
	varying vec2 texCoords;
	varying vec3 fn;
	varying vec3 vertPos;
	void main()
	{
		fn = vec3(normals * vec4(norm, 0.0));
  		vec4 vertPos4 = mv * vec4(pos, 1.0);
  		vertPos = vec3(vertPos4) / vertPos4.w;

		gl_Position = mvp * vec4(pos,1);
		texCoords=txc;

	}
`;
// Fragment shader source code;
var MeshFS = `
	precision mediump float;
	varying vec2 texCoords; 

	uniform sampler2D tex;
	uniform bool textureShown;

	varying vec3 fn;
	varying vec3 vertPos;

	uniform float shininess;
	uniform vec3 lightDirection;

vec4 ambientColor = vec4(1, 1, 1, 1);
vec4 diffuseColor = vec4(0, 0.50, 0.0, 1.0);
vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);
vec4 lightColor = vec4(1.0, 1.0, 1.0, 1.0);
float irradiPerp = 1.0;

vec3 blinnPhongBRDF(vec3 lightDir, vec3 viewDir, vec3 normal, vec3 phongDiffuseCol, vec3 phongSpecularCol, float phongShininess) 
{
  vec3 color = phongDiffuseCol;
  vec3 halfDir = normalize(viewDir + lightDir);
  float specDot = max(dot(halfDir, normal), 0.0);
  color += pow(specDot, phongShininess) * phongSpecularCol;
  return color;
}

	void main()
	{
		vec3 lightDir = normalize(-lightDirection);
  		vec3 viewDir = normalize(-vertPos);
 		vec3 n = normalize(fn);
  		vec3 radiance = ambientColor.rgb;
  
  radiance = pow(radiance, vec3(1.0 / 2.2) ); 
		if(textureShown == true)
		{
			vec4 texelColor = texture2D(tex, texCoords);
			float irradiance = max(dot(lightDir, n), 0.0) * irradiPerp;
			if(irradiance > 0.0) {
			  vec3 brdf = blinnPhongBRDF(lightDir, viewDir, n, texelColor.rgb, texelColor.rgb, shininess);
			  radiance += brdf * irradiance * lightColor.rgb;
			}
			gl_FragColor = vec4(radiance, 1.0);
		}
		else
		{
			vec4 texelColor = vec4(1,1,1,1);
			float irradiance = max(dot(lightDir, n), 0.0) * irradiPerp;
			if(irradiance > 0.0) {
			  vec3 brdf = blinnPhongBRDF(lightDir, viewDir, n, texelColor.rgb, texelColor.rgb, shininess);
			  radiance += brdf * irradiance * lightColor.rgb;
			}
			gl_FragColor = vec4(radiance.rgb, 1.0);
		}
	}
`;