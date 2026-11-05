precision mediump float;

uniform vec2 res;
uniform vec2 mpos;
uniform float time;

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.001;

const float NUC_SEP = 0.332 / 2.0;
const float BASE_SEP = 2.37 / 2.0;
const float NUC_RADIUS = 0.125;
const float PAIR_SEP = 0.125;
const float BASE_RADIUS = NUC_RADIUS;

float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0);
}

float opUnion(float d1, float d2) { return min(d1,d2); }


vec3 opRep( in vec3 p, in vec3 c)
{
    return mod(p,c)-0.5*c;
}

vec3 opTwist( vec3 p )
{
    float  c = cos(1.0*p.y+1.0);
    float  s = sin(1.0*p.y+1.0);
    mat2   m = mat2(c,-s,s,c);
    vec2 r = m*p.xz;
    return vec3(r.x, p.y, r.y);
}

vec3 opBend( vec3 p )
{
    float  c = cos(((time / 5000000.0) - 0.1)*p.x - !factor);
    float  s = sin(mpos.y*p.x+mpos.x);
    mat2   m = mat2(c,-s,s,c);
    vec2 r = m*p.yz;
    return vec3(p.x, r.x, r.y);
}

float sceneSDF(vec3 samplePoint) {
    samplePoint = opBend(samplePoint);
    samplePoint = opTwist(samplePoint);
    samplePoint.z = abs(samplePoint.z);
    samplePoint.z = samplePoint.z - (BASE_SEP / 2.0);
    samplePoint = opRep(samplePoint + vec3(0, NUC_RADIUS, 0), vec3(0, NUC_SEP, 0));
    float box = sdBox(samplePoint + vec3(0.0, 0.0, 0.0), vec3(BASE_RADIUS, NUC_SEP, BASE_RADIUS));
    float bases = sdBox(samplePoint + vec3(0, 0.0, (BASE_SEP / 4.0) - PAIR_SEP), vec3(NUC_RADIUS, NUC_RADIUS, BASE_SEP / 4.0));
    return opUnion(box, bases);
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
			return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(4.0,
                          2.0,
                          4.0);
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);  
    return color;
}

mat3 genViewMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

void main() {
    vec3 viewDir = rayDirection(45.0, res, gl_FragCoord.xy);
    vec3 eye = vec3(10.0, 0, 0);
    
    mat3 viewToWorld = genViewMatrix(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    
    vec3 worldDir = viewToWorld * viewDir;
    
    float dist = shortestDistanceToSurface(eye, worldDir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
    }
    
    vec3 p = eye + dist * worldDir;

    vec3 K_a = (estimateNormal(p) + vec3(1.0)) / 2.0;
    vec3 K_d = K_a;
    vec3 K_s = vec3(1.0, 1.0, 1.0);
    float shininess = 1.0;
    
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    
    gl_FragColor = vec4(color, 1.0);
}