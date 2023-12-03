import { BasicMaterial } from "./BasicMaterial.js";

export class PhongMaterial extends BasicMaterial{
    constructor(diffuse, texture = null){
        super(diffuse);
        this.Ka = [1, 1, 1];
        this.Ks = [1, 1, 1];
        this.Ns = 200;
        this.D = 1;
        this.illum = 2;
        this.texturePath = texture;
    }

    setAmbient(Ka){
        this.Ka = Ka;
    }
    
    setSpecular(Ks){
        this.Ks = Ks;
    }

    setSpecularExponent(Ns){
        this.Ns = Ns;
    }

    setTransparency(D){
        this.D = D;
    }

    setIllum(illum){
        this.illum = illum;
    }

    setTexture(texture){
        this.texturePath = texture;
    }
}