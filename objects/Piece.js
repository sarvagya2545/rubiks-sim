import * as THREE from 'three';

class Piece {
    constructor(size, colors, borderColor) {
        this.size = size;
        this.colors = colors;
        this.borderColor = borderColor;

        // create cube geometry
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size).toNonIndexed();
        this.material = new THREE.MeshBasicMaterial({ vertexColors: true });

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
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(pieceColors, 3));
        this.cube = new THREE.Mesh(this.geometry, this.material);

        // add border to edges of the cube
        const edges = new THREE.EdgesGeometry(this.geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: this.borderColor });
        const line = new THREE.LineSegments(edges, edgeMaterial);
        this.cube.add(line);
    }
}