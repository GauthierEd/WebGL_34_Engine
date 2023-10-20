import { Camera } from "./Camera.js";

export class TrackingCamera extends Camera {
    constructor(fov, minZ, maxZ){
        super(fov, minZ, maxZ);
    }

    update(){
        mat4.translate(this.matrice, this.matrice, this.position);
        mat4.rotateX(this.matrice, this.matrice, this.roll * Math.PI / 180);
        mat4.rotateY(this.matrice, this.matrice, this.pitch * Math.PI / 180);

        const position = vec4.create();
        vec4.set(position, 0, 0, 0, 1);
        vec4.transformMat4(position, position, this.matrix);
        vec3.copy(this.position, position);

        this.updateUp();
        this.updateFront();
    }

    zoom(step){
        const front = vec3.create();
        const newPos = vec3.create();
        vec3.normalize(front, this.front);
        newPos[0] = this.position[0] - step * front[0];
        newPos[1] = this.position[1] - step * front[1];
        newPos[2] = this.position[2] - step * front[2];

        this.setPosition(newPos)
    }
}