import { Light } from "./Light.js";

export class SpotLight extends Light{
    constructor(name = "SpotLight"){
        super(name);
        this.position = [0, 0, 0];
        this.direction = [0, 0, 0];
    }

    setPosition(position){
        this.position = position;
    }

    setDirection(direction){
        this.direction = direction;
    }

    lookAt(focus){
        let direction = vec3.create();
        vec3.set(direction, focus[0] - this.position[0],
                            focus[1] - this.position[1] ,
                            focus[2] - this.position[2]);
        vec3.normalize(direction, direction);
        this.direction[0] = direction[0];
        this.direction[1] = direction[1];
        this.direction[2] = direction[2];
    }   
}