import { Light } from "./Light.js";

export class DirectionalLight extends Light{
    constructor(name = "DirectionalLight"){
        super(name);
        this.direction = vec3.create();
    }

    setDirection(direction){
        vec3.copy(this.direction, direction);
    }
}