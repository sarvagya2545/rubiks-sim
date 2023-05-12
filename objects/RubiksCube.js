import * as THREE from 'three';
import Piece from "./Piece";
import { rubiksColorsHex, insideColor, layerPieceCoordinates, layerAxis, layerCornerRotations, layerEdgeRotations, rotationLayers, PIECE_SIZE, X_AXIS, Y_AXIS, Z_AXIS, ORIGIN } from '../constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class RubiksCube {
    cubeList = [
        [[], [], []],
        [[], [], []],
        [[], [], []]
    ];

    SCRAMBLE_SIZE = 20;

    constructor(canvasDOMElement) {
        this.initWorld(canvasDOMElement);
        this.initCube();
    }

    initWorld(canvasDOMElement) {
        // Setup three js scene, camera and renderer
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasDOMElement
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera.position.setZ(30);
        this.camera.position.setY(30);
        this.camera.position.setX(30);
        this.renderer.render(this.scene, this.camera);

        // Orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // Show the coordinate axes
        this.arrowHelpers = [
            new THREE.ArrowHelper(X_AXIS, ORIGIN, 20, 0x0000FF, 5, 2),
            new THREE.ArrowHelper(Y_AXIS, ORIGIN, 20, 0xFF0000, 5, 2),
            new THREE.ArrowHelper(Z_AXIS, ORIGIN, 20, 0x00FF00, 5, 2)
        ];

        this.arrowHelpers.forEach(arrowHelper => {
            arrowHelper.visible = false;
            this.scene.add(arrowHelper);
        });
    }

    initCube() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const colorsArray = this.getColorsArray(rubiksColorsHex, insideColor, x, y, z);
                    const piece = new Piece(PIECE_SIZE, colorsArray, insideColor);
                    piece.setPosition(x * PIECE_SIZE, y * PIECE_SIZE, z * PIECE_SIZE);

                    this.scene.add(piece.cube);
                    this.cubeList[x + 1][y + 1][z + 1] = piece;
                }
            }
        }
    }

    // function to remove invisible inside colors from the piece
    getColorsArray(rubiksColorsHex, insideColor, x, y, z) {
        // +x => R, -x => L
        // +y => U, -y => D
        // +z => F, -z => B
        // [R, L, U, D, F, B]
        const colors = [...rubiksColorsHex];
        if (x >= 0) colors[1] = insideColor;
        if (x <= 0) colors[0] = insideColor;

        if (y >= 0) colors[3] = insideColor;
        if (y <= 0) colors[2] = insideColor;

        if (z >= 0) colors[5] = insideColor;
        if (z <= 0) colors[4] = insideColor;

        return colors;
    }

    // Function to move a layer in either clockwise or counter clockwise direction
    moveLayer(layer, clockwise = true) {
        const pieceCoors = layerPieceCoordinates[layer]

        const axis = layerAxis[layer];
        // rotate the selected pieces in UI
        pieceCoors.forEach(([x, y, z]) => {
            const piece = this.cubeList[x + 1][y + 1][z + 1];
            piece.rotatePieceAroundWorldAxis(axis, 90 * (clockwise ? -1 : 1));
        })
        // move around the data in the cubeList

        // rotate corners in the layer move
        const [c1, c2, c3, c4] = layerCornerRotations[layer];
        let [w, x, y, z] = [
            this.cubeList[c1[0]][c1[1]][c1[2]],
            this.cubeList[c2[0]][c2[1]][c2[2]],
            this.cubeList[c3[0]][c3[1]][c3[2]],
            this.cubeList[c4[0]][c4[1]][c4[2]]
        ];

        if (clockwise) {
            [
                this.cubeList[c1[0]][c1[1]][c1[2]],
                this.cubeList[c2[0]][c2[1]][c2[2]],
                this.cubeList[c3[0]][c3[1]][c3[2]],
                this.cubeList[c4[0]][c4[1]][c4[2]]
            ] = [z, w, x, y];
        } else {
            [
                this.cubeList[c1[0]][c1[1]][c1[2]],
                this.cubeList[c2[0]][c2[1]][c2[2]],
                this.cubeList[c3[0]][c3[1]][c3[2]],
                this.cubeList[c4[0]][c4[1]][c4[2]]
            ] = [x, y, z, w];
        }

        // rotate edges in layer move
        const [e1, e2, e3, e4] = layerEdgeRotations[layer];
        [w, x, y, z] = [
            this.cubeList[e1[0]][e1[1]][e1[2]],
            this.cubeList[e2[0]][e2[1]][e2[2]],
            this.cubeList[e3[0]][e3[1]][e3[2]],
            this.cubeList[e4[0]][e4[1]][e4[2]]
        ];

        if (clockwise) {
            [
                this.cubeList[e1[0]][e1[1]][e1[2]],
                this.cubeList[e2[0]][e2[1]][e2[2]],
                this.cubeList[e3[0]][e3[1]][e3[2]],
                this.cubeList[e4[0]][e4[1]][e4[2]]
            ] = [z, w, x, y];
        } else {
            [
                this.cubeList[e1[0]][e1[1]][e1[2]],
                this.cubeList[e2[0]][e2[1]][e2[2]],
                this.cubeList[e3[0]][e3[1]][e3[2]],
                this.cubeList[e4[0]][e4[1]][e4[2]]
            ] = [x, y, z, w];
        }
    }

    // function to rotate the cube orientation
    rotateCube(sliceLayer, clockwise = true) {
        const [clockwiseLayers, antiClockwiseLayers] = rotationLayers[sliceLayer];
        for (let layer of clockwiseLayers) {
            this.moveLayer(layer, clockwise);
        }

        for (let layer of antiClockwiseLayers) {
            this.moveLayer(layer, !clockwise);
        }
    }

    // Scramble the cube
    scramble(scrambleSize) {
        scrambleSize = scrambleSize ?? this.SCRAMBLE_SIZE;
        const keys = Object.keys(layerAxis);
        for (let i = 0; i < scrambleSize; i++) {
            const randomMoveIndex = Math.floor(Math.random() * keys.length);
            const randomMove = keys[randomMoveIndex];
            this.moveLayer(randomMove);
        }
    }
};