function triangle(pts, zbuffer, intensity, data) {
    if (intensity <= 0) return;
    const [t0, t1, t2] = pts;
    const [min, max] = bounding_box(pts);

    for (let x = min[0]; x <= max[0]; x++) {
        for (let y = min[1]; y <= max[1]; y++) {
            const bc_screen = barycentric(t0, t1, t2, [x,y]);
            if (bc_screen[0] < 0 || bc_screen[1] < 0 || bc_screen[2] < 0) {
                continue;
            }
            let z = t0[2] * bc_screen[0] +
                t1[2] * bc_screen[1] +
                t2[2] * bc_screen[2];

            let i = x + y*size;
            if (zbuffer[i] < z) {
                zbuffer[i] = z;
                [R, G, B] = [intensity*174, intensity*115, intensity*78];
                render(x, y, data);
            }
        }
    }
}

function barycentric(A, B, C, P) {
    const u = cross(
        [ C[0]-A[0], B[0]-A[0], A[0]-P[0] ],
        [ C[1]-A[1], B[1]-A[1], A[1]-P[1] ]
    );

    if (Math.abs(u[2]) < 1) {
        return [-1, -1, -1];
    }
    return [1 - (u[0]+u[1])/u[2], u[1]/u[2], u[0]/u[2]];
}

// function triangle_area_2d(a, b, c) {
//     return 0.5*((b[1]-a[1])*(b[0]+a[0]) + (c[1]-b[1])*(c[0]+b[0]) + (a[1]-c[1])*(a[0]+c[0]));
// }

// function barycentric(A, B, C, P) {
//     const total_area = triangle_area_2d(A, B, C);
//     const u = triangle_area_2d(P, B, C);
//     const v = triangle_area_2d(P, C, A);
//     const w = triangle_area_2d(P, A, B);
//     return [u/total_area, v/total_area, w/total_area];
// }

function triangle_simple(t0, t1, t2, data) {
    const pts = [t0, t1, t2];
    const [min, max] = bounding_box(pts);

    for (let x = min[0]; x <= max[0]; x++) {
        for (let y = min[1]; y <= max[1]; y++) {
            const bc_screen = barycentric(t0, t1, t2, [x,y]);
            if (bc_screen[0] < 0 || bc_screen[1] < 0 || bc_screen[2] < 0) {
                continue;
            }
            render(x, y, data);
        }
    }
}

// function triangle_old(t0, t1, t2, data) {
//     if (t0[1] > t1[1]) {
//         [t0, t1] = [t1, t0];
//     }
//     if (t0[1] > t2[1]) {
//         [t0, t2] = [t2, t0];
//     }
//     if (t1[1] > t2[1]) {
//         [t1, t2] = [t2, t1];
//     }

//     const total_height = t2[1] - t0[1];
//     for (let i=0; i<total_height; i++) {
//         const second_half = i > t1[1] - t0[1] || t1[1] === t0[1];
//         const segment_height = second_half? t2[1] - t1[1] : t1[1] - t0[1];
//         const alpha = i/total_height;
//         const beta = (i - (second_half? t1[1] - t0[1] : 0)) / segment_height;
//         let vecA = add(t0, floor(mul(sub(t2, t0), alpha)));
//         let vecB = second_half?
//             add(t1, floor(mul(sub(t2, t1), beta))) :
//             add(t0, floor(mul(sub(t1, t0), beta)));

//         if (vecA[0] > vecB[0]) {
//             [vecA, vecB] = [vecB, vecA];
//         }
//         for (let j=vecA[0]; j<=vecB[0]; j++) {
//             render(j, t0[1]+i, data);
//         }
//     }
// }
