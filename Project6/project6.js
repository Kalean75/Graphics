var raytraceFS = `
struct Ray {
	vec3 pos;
	vec3 dir;
};

struct Material {
	vec3  k_d;	// diffuse coefficient
	vec3  k_s;	// specular coefficient
	float n;	// specular exponent
};

struct Sphere {
	vec3     center;
	float    radius;
	Material mtl;
};

struct Light {
	vec3 position;
	vec3 intensity;
};

struct HitInfo {
	float    t;
	vec3     position;
	vec3     normal;
	Material mtl;
};

uniform Sphere spheres[ NUM_SPHERES ];
uniform Light  lights [ NUM_LIGHTS  ];
uniform samplerCube envMap;
uniform int bounceLimit;

bool IntersectRay( inout HitInfo hit, Ray ray );

// Shades the given point and returns the computed color.
vec3 Shade( Material mtl, vec3 position, vec3 normal, vec3 view )
{
	vec3 color = vec3(0,0,0);
	for ( int i=0; i<NUM_LIGHTS; ++i ) 
	{
		vec3 n = normalize(normal);
		vec3 l = normalize(lights[i].position - position);
		vec3 h = normalize(l + view);
		float theta = max(dot(l,n), 0.0);
		float phi = pow(max(dot(n,h),0.0), mtl.n);


		// TO-DO: Check for shadows
		Ray shadowRay;
		shadowRay.dir = l;
		shadowRay.pos = position;
		HitInfo hi;
		float bias = 0.1;
		if(!IntersectRay(hi, shadowRay) && hi.t > bias)
		{
			// TO-DO: If not shadowed, perform shading using the Blinn model
			color += lights[i].intensity*(mtl.k_d * theta + mtl.k_s*(phi));	// change this line
		}
	}
	return color;
}

// Intersects the given ray with all spheres in the scene
// and updates the given HitInfo using the information of the sphere
// that first intersects with the ray.
// Returns true if an intersection is found.
bool IntersectRay( inout HitInfo hit, Ray ray )
{
	hit.t = 1e30;
	bool foundHit = false;
	for ( int i=0; i<NUM_SPHERES; ++i ) 
	{
		//(d*d)t^2 + 2d*(p-c)t+(p-c)*(p-c)-r^2
		// {  a  }   {    b   }{      c       }  
		// TO-DO: Test for ray-sphere intersection
		float a = dot(ray.dir,ray.dir);
		float b = dot(vec3(2.0), (ray.dir * (ray.pos-spheres[i].center)));
		float c = dot(ray.pos-spheres[i].center,ray.pos-spheres[i].center) - pow(spheres[i].radius,2.0);
		float delta = pow(b,2.0)-4.0*(a*c);
	
		float newT = (-b - sqrt(delta))/(2.0*a);
		// TO-DO: If intersection is found, update the given HitInfo
		if(newT >= 0.0 && newT < hit.t)
		{
			foundHit = true;
			hit.t = newT;
			hit.mtl = spheres[i].mtl;
			hit.position = ray.pos + hit.t * ray.dir;
			hit.normal = normalize(hit.position-spheres[i].center);
		}
	}
	return foundHit;
}

// Given a ray, returns the shaded color where the ray intersects a sphere.
// If the ray does not hit a sphere, returns the environment color.
vec4 RayTracer( Ray ray )
{
	HitInfo hit;
	if ( IntersectRay( hit, ray ) ) 
	{
		vec3 view = normalize( -ray.dir );
		vec3 clr = Shade( hit.mtl, hit.position, hit.normal, view );
		
		// Compute reflections
		vec3 k_s = hit.mtl.k_s;
		for ( int bounce=0; bounce<MAX_BOUNCES; ++bounce ) 
		{
			if ( bounce >= bounceLimit )
			{
				break;
			}
			if ( hit.mtl.k_s.r + hit.mtl.k_s.g + hit.mtl.k_s.b <= 0.0 )
			{
				break;
			}
			
			Ray r;	// this is the reflection ray
			HitInfo h;	// reflection hit info
			
			// TO-DO: Initialize the reflection ray
			r.dir = 2.0*(view * hit.normal)* hit.normal - view;
			r.pos = hit.position;
			if (IntersectRay( h, r ) ) 
			{
				view = normalize(-r.dir);
				// TO-DO: Hit found, so shade the hit point
				clr += Shade( h.mtl, h.position, h.normal, view);

				// TO-DO: Update the loop variables for tracing the next reflection ray
				hit = h;
				
			} 
			else 
			{
				// The reflection ray did not intersect with anything,
				// so we are using the environment color
				clr += k_s * textureCube( envMap, r.dir.xzy ).rgb;
				break;	// no more reflections
			}
		}
		return vec4( clr, 1 );	// return the accumulated color, including the reflections
	} 
	else 
	{
		//opacity set to 1???
		return vec4( textureCube( envMap, ray.dir.xzy ).rgb, 0 );	// return the environment color
	}
}
`;