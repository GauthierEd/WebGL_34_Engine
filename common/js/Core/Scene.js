import { Object3D } from "./Object3D.js";
import { BoxGeometrie } from "../Geometry/BoxGeometrie.js";
import { Mesh } from "./Mesh.js";
import { PhongMaterial } from "../Material/PhongMaterial.js";

export class Scene extends Object3D{
    constructor(gl, program){
        super("scene");
        this.gl = gl;
        this.program = program;
    }

    addFloor(){
        let mesh = new Mesh(new BoxGeometrie, new PhongMaterial([0.5, 0.5, 0.5]), "floor");
        this.add(mesh, this.gl, this.program);
        mesh.translateY(-1);
        mesh.setScale([200, 1, 200])
    }
}