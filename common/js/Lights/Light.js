export class Light {
    constructor(name = "light"){
        this.name = name;
        this.diffuse = [1, 1, 1, 1];
        this.ambient = [0.1, 0.1, 0.1, 1];
        this.specular = [1, 1, 1, 1];
    }

    setDiffuse(diffuse){
        this.diffuse = diffuse;
    }

    setAmbient(ambient){
        this.ambient = ambient;
    }

    setSpecular(specular){
        this.specular = specular;
    }
}