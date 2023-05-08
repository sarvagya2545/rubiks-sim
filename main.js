import {
    layerAxis,
    rotationAxis
} from './constants';
import RubiksCube from './objects/RubiksCube';

const rubiksCube = new RubiksCube(document.getElementById('bg'));

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
    }
})

/**************   ANIMATION LOOP    **************/
function animate() {
    requestAnimationFrame(animate);

    // update the scene
    rubiksCube.controls.update();

    // render the updated scene
    rubiksCube.renderer.render(rubiksCube.scene, rubiksCube.camera);
}

animate();