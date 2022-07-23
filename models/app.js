const body = document.body;
const html = document.documentElement;

const width = Math.max( body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth );

const height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight ) - 85;

console.log('width:', width);
console.log('height:', height);

const size = Math.min(width, height);
const scale = 1;
let [R, G, B] = [255, 255, 255];
const light_source = [0, 0, -0.5];

const frameTime = document.getElementById('frame-time');
const canvas = document.getElementById('canvas');
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext('2d');
ctx.fillRect(0,0, size, size);
console.log(canvas, canvas.width, canvas.height);

function line(p, q, data) {
    let x0 = p[0]; let y0 = p[1];
    let x1 = q[0]; let y1 = q[1];

    let steep = false;
    if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
        steep = true;
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    let dx = x1 - x0;
    let dy = y1 - y0;
    let derror = Math.abs(dy) * 2;
    let error = 0;
    let y = y0;

    for (let x=x0; x <= x1; x++) {
        if (steep) {
            render(y,x, data);
        } else {
            render(x,y, data);
        }
        error += derror;
        if (error > dx) {
            y += (y1 > y0)? 1 : -1;
            error -= dx*2;
        }
    }
}

function clear() {
    ctx.fillRect(0,0, size, size);
}

function render(x, y, data) {
    const p = transform([x, y]);
    const i = p[0] + p[1]*size;
    data[i*4]     = R;
    data[i*4 + 1] = G;
    data[i*4 + 2] = B;
    data[i*4 + 3] = 255;
}

function transform(point) {
    return [point[0], size - point[1]];
}

function dot(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function cross(a, b) {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
}

function mul(vec, t) {
    return [vec[0] * t, vec[1] * t, vec[2] * t, vec[3] * t];
}

function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function floor(vec) {
    return [Math.floor(vec[0]), Math.floor(vec[1]), Math.floor(vec[2])];
}

// direction from b to a
function dir(b, a) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(vec) {
    const len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
    return [vec[0]/len, vec[1]/len, vec[2]/len];
}

function bounding_box(pts) {
    const min = [size-1, size-1];
    const max = [0, 0];
    const clamp = [size-1, size-1];
    for (let i=0; i<pts.length; i++) {
        min[0] = Math.max(0, Math.min(min[0], pts[i][0]));
        min[1] = Math.max(0, Math.min(min[1], pts[i][1]));

        max[0] = Math.min(clamp[0], Math.max(max[0], pts[i][0]));
        max[1] = Math.min(clamp[1], Math.max(max[1], pts[i][1]));
    }

    return [min, max];
}
