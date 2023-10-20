import { Camera } from "./Camera.js";

export class OrbitingCamera extends Camera {
    constructor(fov, minZ, maxZ){
        super(fov, minZ, maxZ);
    }

    update(){
        mat4.identity(this.matrice);
        mat4.rotateY(this.matrice, this.matrice, this.roll * Math.PI / 180);
        mat4.rotateX(this.matrice, this.matrice, this.pitch * Math.PI / 180);
        mat4.translate(this.matrice, this.matrice, this.position);

        this.updateUp();
        this.updateFront(); 
    }

    zoom(step){
        const front = vec3.create();
        const newPos = vec3.create();
        vec3.normalize(front, this.front);
        newPos[0] = this.position[0];
        newPos[1] = this.position[1];
        newPos[2] = this.position[2] - step;

        this.setPosition(newPos)
    }
}