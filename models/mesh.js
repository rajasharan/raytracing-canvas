function mesh(data) {
    const zbuffer = [];
    for (let i=0; i<size*size; i++) {
        zbuffer.push(Number.MIN_SAFE_INTEGER);
    }
    for (const face of faces) {
        const screen_coords = [];
        const world_coords = [];
        for (let j=0; j<3; j++) {
            const v = vertices[face[j]];
            screen_coords.push(floor([
                ((v[0]+scale)/scale)*size/2,
                ((v[1]+scale)/scale)*size/2,
                v[2],
            ]));

            world_coords.push(v);
        }

        const n = normalize(cross(
            sub(world_coords[2], world_coords[0]),
            sub(world_coords[1], world_coords[0])
        ));

        const intensity = dot(n, normalize(light_source));
        triangle(screen_coords, zbuffer, intensity, data);
    }
}

// function mesh_lines(data) {
//     for (const face of faces) {
//         for (let i=0; i<face.length; i++) {
//             const v0 = vertices[face[i]];
//             const v1 = vertices[face[(i+1)%face.length]];
//             const x0 = Math.floor(((v0[0]+scale)/scale)*size/2);
//             const y0 = Math.floor(((v0[1]+scale)/scale)*size/2);
//             const x1 = Math.floor(((v1[0]+scale)/scale)*size/2);
//             const y1 = Math.floor(((v1[1]+scale)/scale)*size/2);
//             line([x0, y0], [x1, y1], data);
//         }
//     }
// }
