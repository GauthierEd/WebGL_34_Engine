import { Object3D } from "./Object3D.js";

export class Scene extends Object3D{
    constructor(gl, program){
        super("scene");
        this.gl = gl;
        this.program = program;
    }
}