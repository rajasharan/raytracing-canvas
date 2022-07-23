function draw(fn) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const start = new Date().getTime();

    fn(data);

    const end = new Date().getTime();
    frameTime.innerHTML = `LastFrame: ${end - start} ms<br>LightSource: {${-light_source[0].toLocaleString('en')}, ${-light_source[1].toLocaleString('en')}, ${light_source[2].toLocaleString('en')}}`;
    ctx.putImageData(imageData, 0, 0);
}

function drawRandomLines(num) {
    draw((data) => {
        for (let i=0; i<num; i++) {
            const p = [Math.floor(Math.random() * 1000) % size, Math.floor(Math.random() * 1000) % size];
            const q = [Math.floor(Math.random() * 1000) % size, Math.floor(Math.random() * 1000) % size];
            line(p, q, data);

            // const point_a = [13, 20];
            // const point_b = [80, 40];

            // const point_c = [20, 13];
            // const point_d = [40, 80];

            // const point_e = [80, 40];
            // const point_f = [13, 20];

            // line(point_a, point_b, data);
            // line(point_c, point_d, data);
            // line(point_e, point_f, data);
        }
    });
}

function drawLine(p, q) {
    draw((data) => {
        line(p, q, data);
    });
}

function drawTriangles() {
    draw((data) => {
        const t0 = [[10, 70], [50, 160], [70, 80]];
        const t1 = [[180, 50], [150, 1], [70, 180]];
        const t2 = [[180, 150], [120, 160], [130, 180]];

        triangle_simple(t0[0], t0[1], t0[2], data);
        triangle_simple(t1[0], t1[1], t1[2], data);
        triangle_simple(t2[0], t2[1], t2[2], data);
    });
}

function drawMesh() {
    draw(mesh);
}
