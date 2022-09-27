
//Devin White
//U0775759
//CS 4600
//Project 3 -Bezier Curves
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

		// This is a good place to get the locations of attributes and uniform variables.
		// Initialize the attribute buffer
		this.buffer = gl.createBuffer();
		//num of points?
		this.steps = 100;
		var tv = [];
		for (var i = 0; i < this.steps; ++i) 
		{
			tv.push(i / (this.steps - 1));
		}
		// This is where you can create and set the contents of the vertex buffer object
		// for the vertex attribute we need.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
	}
	setViewport(width, height) {
		// This is where we should set the transformation matrix.
		// Do not forget to bind the program before you set a uniform variable value.
		// Compute the orthographic projection matrix and send it to the shader
		var trans = [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1];
		gl.useProgram(this.prog);	// Bind the program
		gl.uniformMatrix4fv(this.mvp, false, trans);
	}
	updatePoints(pt) 
	{
		// The control points have changed, we must update corresponding uniform variables.
		// Do not forget to bind the program before you set a uniform variable value.
		// We can access the x and y coordinates of the i^th control points using
		//var x = pt[i].getAttribute("cx");
		//var y = pt[i].getAttribute("cy");
		gl.useProgram(this.prog);
		this.cp = [];
		this.cp.push(gl.getUniformLocation(this.prog, `p0`));
		this.cp.push(gl.getUniformLocation(this.prog, `p1`));
		this.cp.push(gl.getUniformLocation(this.prog, `p2`));
		this.cp.push(gl.getUniformLocation(this.prog, `p3`));
		for (var i = 0; i < 4; i++) 
		{
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
			gl.uniform2fv(this.cp[i], new Float32Array([x, y]));
		}
		//gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cp), gl.STATIC_DRAW);
	}
	draw() 
	{
		//  This is where we give the command to draw the curve.
		//  Do not forget to bind the program and set the vertex attribute.
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