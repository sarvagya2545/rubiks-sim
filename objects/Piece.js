import * as THREE from 'three';
import { ORIGIN } from '../constants';

// create a new method to rotate a face
THREE.Object3D.prototype.rotateAroundWorldAxis = function () {

    // rotate object around axis in world space (the axis passes through point)
    // axis is assumed to be normalized
    // assumes object does not have a rotated parent

    let q = new THREE.Quaternion();

    return function rotateAroundWorldAxis(point, axis, angle) {

        q.setFromAxisAngle(axis, angle);

        this.applyQuaternion(q);

        this.position.sub(point);
        this.position.applyQuaternion(q);
        this.position.add(point);

        return this;

    }

}();

class Piece {
    constructor(size, colors, borderColor) {
        this.size = size;
        this.colors = colors;
        this.borderColor = borderColor;

        // create cube geometry
        let geometry = new THREE.BoxGeometry(this.size, this.size, this.size).toNonIndexed();
        let material = new THREE.MeshBasicMaterial({ vertexColors: true });

        // Add colors to the created cube
        const pieceColors = [];
        const color = new THREE.Color();

        this.colors.forEach(colorHex => {
            color.setHex(colorHex);

            // each face is made of 2 triangles with diff vertices
            // fill both triangle faces with the same color
            const colorVectorRGB = [color.r, color.g, color.b]
            const triangleColor = Array(3).fill(colorVectorRGB).flat();

            // push 2 colored triangles to render a face
            pieceColors.push(...triangleColor, ...triangleColor);
        });

        // set the color attribute to color the whole cube
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(pieceColors, 3));
        this.cube = new THREE.Mesh(geometry, material);

        // add border to edges of the cube
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: this.borderColor });
        const line = new THREE.LineSegments(edges, edgeMaterial);
        this.cube.add(line);
    }

    getPiece() {
        return this.cube;
    }

    setPosition(x, y, z) {
        this.cube.position.setX(x);
        this.cube.position.setY(y);
        this.cube.position.setZ(z);
    }

    rotatePieceAroundWorldAxis(axis, angle) {
        this.cube.rotateAroundWorldAxis(ORIGIN, axis, THREE.MathUtils.degToRad(angle));
    }
}

export default Piece;