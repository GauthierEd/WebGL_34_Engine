export class BasicMaterial {
    constructor(diffuse = [0, 0, 0], wireframe = false){
        this.Kd = diffuse;
        this.wireframe = wireframe;
    }

    setDiffuse(Kd){
        this.Kd = Kd;
    }
}