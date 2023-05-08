import * as THREE from 'three';

/**************   CONSTANTS    **************/
export const PIECE_SIZE = 3;
export const ORIGIN = new THREE.Vector3(0, 0, 0);

export const X_AXIS = new THREE.Vector3(1, 0, 0);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);
export const Z_AXIS = new THREE.Vector3(0, 0, 1);

export const NEG_X_AXIS = new THREE.Vector3(-1, 0, 0);
export const NEG_Y_AXIS = new THREE.Vector3(0, -1, 0);
export const NEG_Z_AXIS = new THREE.Vector3(0, 0, -1);

export const layerAxis = {
    'U': Y_AXIS,
    'R': X_AXIS,
    'F': Z_AXIS,
    'L': NEG_X_AXIS,
    'D': NEG_Y_AXIS,
    'B': NEG_Z_AXIS,
    'M': NEG_X_AXIS,
    'E': NEG_Y_AXIS,
    'S': Z_AXIS,
};

export const rotationAxis = {
    'x': X_AXIS,
    'y': Y_AXIS,
    'z': Z_AXIS
};

export const rotationLayers = {
    // first list contains layers to be rotated clockwise
    // second list contains layers to be rotated counter clockwise
    'x': [['R'], ['M', 'L']],
    'y': [['U'], ['E', 'D']],
    'z': [['F', 'S'], ['B']],
}

// pieces of layers
export const layerPieceCoordinates = {
    'U': [
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, 1, 1], [0, 1, 1], [1, 1, 1]
    ],
    'D': [
        [-1, -1, -1], [0, -1, -1], [1, -1, -1],
        [-1, -1, 0], [0, -1, 0], [1, -1, 0],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1]
    ],
    'R': [
        [1, -1, -1], [1, 0, -1], [1, 1, -1],
        [1, -1, 0], [1, 0, 0], [1, 1, 0],
        [1, -1, 1], [1, 0, 1], [1, 1, 1]
    ],
    'L': [
        [-1, -1, -1], [-1, 0, -1], [-1, 1, -1],
        [-1, -1, 0], [-1, 0, 0], [-1, 1, 0],
        [-1, -1, 1], [-1, 0, 1], [-1, 1, 1]
    ],
    'F': [
        [-1, 1, 1], [0, 1, 1], [1, 1, 1],
        [-1, 0, 1], [0, 0, 1], [1, 0, 1],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1]
    ],
    'B': [
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [-1, -1, -1], [0, -1, -1], [1, -1, -1]
    ],
    'M': [
        [0, -1, -1], [0, 0, -1], [0, 1, -1],
        [0, -1, 0], [0, 0, 0], [0, 1, 0],
        [0, -1, 1], [0, 0, 1], [0, 1, 1]
    ],
    'E': [
        [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [-1, 0, 0], [0, 0, 0], [1, 0, 0],
        [-1, 0, 1], [0, 0, 1], [1, 0, 1]
    ],
    'S': [
        [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, 0, 0], [0, 0, 0], [1, 0, 0],
        [-1, -1, 0], [0, -1, 0], [1, -1, 0]
    ],
}

export const layerCornerRotations = {
    'U': [
        [0, 2, 0],
        [2, 2, 0],
        [2, 2, 2],
        [0, 2, 2]
    ],
    'R': [
        [2, 2, 2],
        [2, 2, 0],
        [2, 0, 0],
        [2, 0, 2]
    ],
    'L': [
        [0, 0, 0],
        [0, 2, 0],
        [0, 2, 2],
        [0, 0, 2]
    ],
    'D': [
        [0, 0, 0],
        [0, 0, 2],
        [2, 0, 2],
        [2, 0, 0]
    ],
    'F': [
        [0, 2, 2],
        [2, 2, 2],
        [2, 0, 2],
        [0, 0, 2]
    ],
    'B': [
        [2, 2, 0],
        [0, 2, 0],
        [0, 0, 0],
        [2, 0, 0]
    ],

    // corner rotations for slice layers are just slice edge rotations
    'M': [
        [1, 0, 0],
        [1, 2, 0],
        [1, 2, 2],
        [1, 0, 2]
    ],
    'E': [
        [0, 1, 0],
        [0, 1, 2],
        [2, 1, 2],
        [2, 1, 0]
    ],
    'S': [
        [0, 2, 1],
        [2, 2, 1],
        [2, 0, 1],
        [0, 0, 1]
    ],
};

export const layerEdgeRotations = {
    'U': [
        [1, 2, 0], [2, 2, 1], [1, 2, 2], [0, 2, 1]
    ],
    'R': [
        [2, 2, 1], [2, 1, 0], [2, 0, 1], [2, 1, 2]
    ],
    'F': [
        [1, 2, 2], [2, 1, 2], [1, 0, 2], [0, 1, 2]
    ],
    'B': [
        [1, 2, 0], [0, 1, 0], [1, 0, 0], [2, 1, 0]
    ],
    'D': [
        [1, 0, 0], [0, 0, 1], [1, 0, 2], [2, 0, 1]
    ],
    'L': [
        [0, 2, 1], [0, 1, 2], [0, 0, 1], [0, 1, 0]
    ],
    // Edge rotations for slice layers is just center rotations
    'M': [
        [1, 2, 1], [1, 1, 2], [1, 0, 1], [1, 1, 0]
    ],
    'E': [
        [1, 1, 0], [0, 1, 1], [1, 1, 2], [2, 1, 1]
    ],
    'S': [
        [1, 2, 1], [2, 1, 1], [1, 0, 1], [0, 1, 1]
    ],
}

// Rubik's colors matrix
export const rubiksColorsHex = [
    0xb71234, // R
    0xff5800, // L
    0xffffff, // U
    0xffd500, // D
    0x009b48, // F
    0x0046ad  // B
];
export const insideColor = 0x000000;