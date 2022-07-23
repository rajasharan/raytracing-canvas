let wireframe;
let vertices;
let faces;

fetch('./models/african_head.obj')
// fetch('./models/airboat.obj')
// fetch('./models/al.obj')
// fetch('./models/teddy.obj')
    .then(file => file.text())
    .then(obj => obj.split('\n').filter(s => s && !s.startsWith('#')))
    .then(arr => {
        wireframe = arr;
    })
    .then(() => {
        vertices = wireframe
            .filter(s => s.startsWith('v '))
            .map(s => s.split(' '))
            .map(arr => [
                parseFloat(arr[1]),
                parseFloat(arr[2]),
                parseFloat(arr[3]),
            ]);
    })
    .then(() => {
        faces = wireframe
            .filter(s => s.startsWith('f '))
            .map(s => s.split(' '))
            .map(s => s.splice(1))
            .map(arr => {
                const items = [];
                for (const item of arr) {
                    const i = parseInt(item.split('/')[0]) - 1;
                    items.push(i);
                }
                return items;
            });
    })
    .then(drawMesh);
