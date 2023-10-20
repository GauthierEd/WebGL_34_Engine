import { Light } from "./Light.js";

export class PositionalLight extends Light{
    constructor(name = "PositionalLight"){
        super(name);
        this.position = [0, 0, 0];
    }

    setPosition(position){
        this.position = position;
    }
}