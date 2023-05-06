import * as THREE from 'three';

function init() {
    // Setup three js scene, camera and renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg')
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.setZ(30);

    renderer.render(scene, camera);
    return { renderer, scene, camera };
}

const { renderer, scene, camera } = init();

// create cube geometry
const pieceSize = 5;
const pieceGeometry = new THREE.BoxGeometry(pieceSize, pieceSize, pieceSize).toNonIndexed();
const material = new THREE.MeshBasicMaterial({ vertexColors: true });

// Add colors to the created cube
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
pieceGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const cube = new THREE.Mesh(pieceGeometry, material);
scene.add(cube);

// add border to edges of the cube
const edges = new THREE.EdgesGeometry(pieceGeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const line = new THREE.LineSegments(edges, edgeMaterial);
cube.add(line);


// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    renderer.render(scene, camera);
}

animate();