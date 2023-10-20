import { Geometry } from "./Geometry.js";

export class Axis extends Geometry{
    constructor(dimension = 10){
        super();
        this.dimension = dimension;
        this.init(this.dimension);
    }

    init(dimension){
        if (dimension) {
            this.dimension = dimension;
        }
        this.indices = [0, 1, 2, 3, 4, 5];
        this.vertices = [
            -dimension, 0.0, 0.0,
            dimension, 0.0, 0.0,
            0.0, -dimension / 2, 0.0,
            0.0, dimension / 2, 0.0,
            0.0, 0.0, -dimension,
            0.0, 0.0, dimension
        ];
        this.normals = utils.calculateNormals(this.vertices, this.indices);
    }
}