// [TO-DO] Complete the implementation of the following class and the vertex shader below.

class CurveDrawer 
{
	constructor() 
	{
		this.prog = InitShaderProgram(curvesVS, curvesFS);
		// [TO-DO] Other initializations should be done here.
		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');

		// Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation(this.prog, 't');

		// [TO-DO] This is a good place to get the locations of attributes and uniform variables.
		// Initialize the attribute buffer
		this.buffer = gl.createBuffer();
		//number of points
		this.steps = 100;
		var tv = [];
		for (var i = 0; i < this.steps; ++i) 
		{
			tv.push(i / (this.steps - 1));
		}
		// [TO-DO] This is where you can create and set the contents of the vertex buffer object
		// for the vertex attribute we need.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
	}
	setViewport(width, height) {
		// [TO-DO] This is where we should set the transformation matrix.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		// Compute the orthographic projection matrix and send it to the shader
		var trans = [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
		gl.useProgram(this.prog);	// Bind the program
		gl.uniformMatrix4fv(this.mvp, false, trans);
	}
	updatePoints(pt) {
		// [TO-DO] The control points have changed, we must update corresponding uniform variables.
		// [TO-DO] Do not forget to bind the program before you set a uniform variable value.
		// [TO-DO] We can access the x and y coordinates of the i^th control points using
		//var x = pt[i].getAttribute("cx");
		//var y = pt[i].getAttribute("cy");
		gl.useProgram(this.prog);
		this.cp = [];
		this.cp.push(gl.getUniformLocation(this.prog, `p0`));
		this.cp.push(gl.getUniformLocation(this.prog, `p1`));
		this.cp.push(gl.getUniformLocation(this.prog, `p2`));
		this.cp.push(gl.getUniformLocation(this.prog, `p3` ));
		/*for (var i = 0; i < 4; i++) 
		{
			//var x = pt[i].getAttribute("cx");
			//var y = pt[i].getAttribute("cy");
			//p.push(x);
			//p.push(y);
		}*/
		gl.uniform2fv(this.cp[0], new Float32Array([pt[0].getAttribute("cx"), pt[0].getAttribute("cy")]));
		gl.uniform2fv(this.cp[1], new Float32Array([pt[1].getAttribute("cx"), pt[1].getAttribute("cy")]));
		gl.uniform2fv(this.cp[2], new Float32Array([pt[2].getAttribute("cx"), pt[2].getAttribute("cy")]));
		gl.uniform2fv(this.cp[3], new Float32Array([pt[3].getAttribute("cx"), pt[3].getAttribute("cy")]));
		//gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cp), gl.STATIC_DRAW);
	}
	draw() {
		// [TO-DO] This is where we give the command to draw the curve.
		// [TO-DO] Do not forget to bind the program and set the vertex attribute.
		// Draw the line segments
		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer(this.vertPos, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);
		gl.drawArrays(gl.LINE_STRIP, 0, this.steps / 2);
	}
}
//equation for 4 points
//P = (1−t)^3*P1 + 3*(1−t)^2tP2 +3(1−t)t^2P3 + t^3P4
// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{
		vec2 position = ((1.0-t)*(1.0-t)*(1.0-t)*p0)+(3.0*((1.0-t)*(1.0-t))*t*p1)+(3.0*(1.0-t)*(t*t)*p2)+((t*t*t)*p3);
		gl_Position = mvp*vec4(position,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;