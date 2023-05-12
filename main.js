import {
    ORIGIN,
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
    layerAxis,
    rotationAxis
} from './constants';
import RubiksCube from './objects/RubiksCube';
import * as THREE from 'three';

// all the logic for rubiks cube is encapsulated in the RubiksCube class
const rubiksCube = new RubiksCube(document.getElementById('bg'));

// Show a little axes reference in the corner of the screen
const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const arrowRenderer = new THREE.WebGLRenderer({ alpha: true }); // clear
arrowRenderer.setClearColor(0x000000, 0);
arrowRenderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

// add arrow element to the canvas
const arrowCanvas = document.body.appendChild(arrowRenderer.domElement);
arrowCanvas.setAttribute('id', 'arrowCanvas');
arrowCanvas.style.width = CANVAS_WIDTH;
arrowCanvas.style.height = CANVAS_HEIGHT;
arrowCanvas.style.position = 'fixed';
arrowCanvas.style.bottom = 'auto';
arrowCanvas.style.left = 'auto';
arrowCanvas.style.top = '0px';
arrowCanvas.style.right = '0px';

const arrowScene = new THREE.Scene();

const arrowCamera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
arrowCamera.up = rubiksCube.camera.up; // important!

arrowScene.add(new THREE.ArrowHelper(X_AXIS, ORIGIN, 60, 0x0000FF, 20, 10));
arrowScene.add(new THREE.ArrowHelper(Y_AXIS, ORIGIN, 60, 0xFF0000, 20, 10));
arrowScene.add(new THREE.ArrowHelper(Z_AXIS, ORIGIN, 60, 0x00FF00, 20, 10));

/*************** EVENT LISTENERS ***************/

const helpBtn = document.getElementById('help-btn');
const modal = document.getElementById('modal');

const closeModal = (e) => {
    // console.log(e.target);
    if (e.target.id === 'modal') {
        modal.classList.remove('visible')
    }
}

helpBtn.addEventListener('click', e => {
    modal.classList.add('visible')
    modal.addEventListener('click', closeModal);
})

// keydown event listener to call functions
document.addEventListener('keydown', e => {
    // console.log(e.key.toUpperCase())
    if (Object.keys(layerAxis).some(val => val === e.key.toUpperCase())) {

        // console.log('Valid move');
        const upperCaseKey = e.key.toUpperCase();
        rubiksCube.moveLayer(upperCaseKey, upperCaseKey !== e.key);

    } else if (Object.keys(rotationAxis).some(val => val === e.key.toLowerCase())) {

        const lowerCaseKey = e.key.toLowerCase();
        rubiksCube.rotateCube(e.key.toLowerCase(), lowerCaseKey === e.key);

    } else if (e.key.toUpperCase() === 'Q') {
        rubiksCube.scramble();
    } else if (e.key.toLowerCase() === 'a') {
        const toggleArrowHelper = arrowHelper => arrowHelper.visible = !arrowHelper.visible;
        rubiksCube.arrowHelpers.forEach(toggleArrowHelper)
    } else if (e.key.toLowerCase() === 'h') {
        modal.classList.toggle('visible')
    }
})

/**************   ANIMATION LOOP    **************/
function animate() {
    requestAnimationFrame(animate);

    // update the scene
    rubiksCube.controls.update();

    arrowCamera.position.copy(rubiksCube.camera.position);
    arrowCamera.position.sub(rubiksCube.controls.target);
    arrowCamera.position.setLength(300);

    arrowCamera.lookAt(arrowScene.position);

    // render the updated scene
    rubiksCube.renderer.render(rubiksCube.scene, rubiksCube.camera);

    arrowRenderer.render(arrowScene, arrowCamera);
}

animate();