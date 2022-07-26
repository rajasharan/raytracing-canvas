const eye = [1,1,3];
const center = [0,0,0];
const up = [0, 1, 0];

const ViewPort = viewport(size/5, size/5, size, size);
const Projection = projection(eye, center);
const ModelView = lookat(eye, center, up);
console.log({ViewPort, Projection, ModelView});

const M = matrix_mul(ViewPort, matrix_mul(Projection, ModelView));
console.log(M);

function norm(vec) {
    return Math.sqrt(dot(vec, vec));
}

function matrix_mul(m1, m2) {
    const res = identity();
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            for (let k=0; k<4; k++) {
                res[i][j] += m1[i][k] * m2[k][j];
            }
        }
    }
    return res;
}

function matrix_vec(m, v) {
    const res = [];
    for (let i=0; i<m.length; i++) {
        let r = 0;
        for (let j=0; j<v.length; j++) {
            r += m[i][j] * v[j];
        }
        res.push(r);
    }
    res[0] = Math.floor(res[0]/res[3]);
    res[1] = Math.floor(res[1]/res[3]);
    res[2] = Math.floor(res[2]/res[3]);
    return res;
}

function matrix(vec) {
    return [vec[0], vec[1], vec[2], 1];
}

function identity() {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1],
    ];
}

function lookat(eye, center, up) {
    const z = normalize(dir(center, eye));
    const x = normalize(cross(up, z));
    const y = normalize(cross(z, x));
    const res = identity();
    for (let i=0; i<3; i++) {
        res[0][i] = x[i];
        res[1][i] = y[i];
        res[2][i] = z[i];
        res[i][3] = -center[i];
    }
    return res;
}

function projection(eye, center) {
    const res = identity();
    res[3][2] = -1/norm(dir(center, eye));
    return res;
}

function viewport(x, y, w, h) {
    const m = identity();
    m[0][3] = x+w/2;
    m[1][3] = y+h/2;
    m[2][3] = 255/2;

    m[0][0] = w/2;
    m[1][1] = h/2;
    m[2][2] = 255/2;
    return m;
}
