const body = document.body;
const html = document.documentElement;

const width = Math.max( body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth );

const height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight );

console.log('width:', width);
console.log('height:', height);

const size = Math.min(width, height);

const frameTime = document.getElementById('last-frame');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;
console.log(canvas, canvas.width, canvas.height);

document.addEventListener('mousedown', doMouseDown, false);
const lightSource = [-1, -0.1, 0.5];
drawImage();

function doMouseDown(event) {
    event.preventDefault();
    const x = event.pageX;
    const y = event.pageY;

    const X = (Math.min(x,size) - size/2)/size;
    const Y = (size/2 - Math.min(y, size))/size;

    lightSource[0] = -X;
    lightSource[1] = -Y;
    drawImage();
}

function drawImage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const start = new Date().getTime();

    for (let y=0; y < size; y++) {
        for (let x=0; x < size; x++) {
            const i = x + size*y;
            const r = i*4;
            const g = r+1;
            const b = g+1;
            const a = b+1;

            const X = (x - size/2)/size; // -0.5 -> 0.5
            const Y = (size/2 - y)/size; // -0.5 -> 0.5
            const { red, green, blue, alpha } = perPixel(X, Y);

            data[r] = red;
            data[g] = green;
            data[b] = blue;
            data[a] = alpha;
        }
    }

    const stop = new Date().getTime();
    ctx.putImageData(imageData, 0, 0);
    frameTime.innerHTML = `LastFrame: ${stop - start} ms<br>LightSource: {${-lightSource[0].toLocaleString('en')}, ${-lightSource[1].toLocaleString('en')}, ${lightSource[2].toLocaleString('en')}}`;
}

function perPixel(x, y) {
    // const camera = [0, 0, 0];
    const screen = [x, y, 1];
    const sphereOrigin = [0, 0, 3];
    const sphereRadius = 1;

    // at^2 + bt + c = 0
    const a = dot(screen, screen);
    const b = -2 * dot(screen, sphereOrigin);
    const c =  dot(sphereOrigin, sphereOrigin) - (sphereRadius * sphereRadius);

    const discriminant = (b * b) - (4 * a * c);
    if (discriminant >= 0) {
        const t = (-b - Math.sqrt(discriminant))/2*a;
        const intersection = scale(screen, t);
        const normal = normalize(dir(sphereOrigin, intersection));
        const shade = dot(normal, normalize(reverse(lightSource)));
        const angle = Math.acos(shade) * (180 / Math.PI);
        const factor = angle >= 90 ? 0 : (90 - angle)/90;

        return {
            red: 200 * factor,
            green: 100 * factor,
            blue: 20 * factor,
            alpha: 255 * (1 - factor),
        };
    }

    return { red: 255, green: 255, blue: 255, alpha: 255 };
}

function dot(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function scale(vec, t) {
    return [vec[0] * t, vec[1] * t, vec[2] * t];
}

function reverse(vec) {
    return scale(vec, -1);
}

// direction from b to a
function dir(b, a) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(vec) {
    const len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
    return [vec[0]/len, vec[1]/len, vec[2]/len];
}
