import * as THREE from 'three';

function init() {
    // Setup three js scene, camera and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create cube geometry
    const piece = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });

    const colors = [];
    const color = new THREE.Color();
    const rubiksColorsHex = [
        0xffffff,
        0xffd500,
        0x009b48,
        0x0046ad,
        0xb71234,
        0xff5800
    ];

    rubiksColorsHex.forEach(colorHex => {
        color.setHex(colorHex);

        // each face is made of 2 triangles with diff vertices
        // fill both triangle faces with the same color
        const colorVectorRGB = [color.r, color.g, color.b]
        const triangleColor = Array(3).fill(colorVectorRGB).flat();

        // push 2 colored triangles to render a face
        colors.push(...triangleColor, ...triangleColor);
    });

    // set the color attribute to color the whole cube
    piece.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const cube = new THREE.Mesh(piece, material);
    scene.add(cube);

    // renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg')
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.setZ(30);

    renderer.render(scene, camera);
}

init();

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    renderer.render(scene, camera);
}

animate();