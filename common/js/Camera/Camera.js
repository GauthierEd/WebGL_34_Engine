export class Camera{
    constructor(fov, minZ, maxZ){
        this.fov = fov;
        this.minZ = minZ;
        this.maxZ = maxZ;

        this.roll = 0;
        this.pitch = 0;
        this.yaw = 0;

        this.position = vec3.create();
        this.focus = vec3.create();
        this.home = vec3.create();
        this.up = vec3.create();
        this.front = vec3.create();

        this.matrice = mat4.create();
    }
    
    updateUp(){
        const up = vec4.create();
        vec4.set(up, 0, 1, 0, 0);
        vec4.transformMat4(up, up, this.matrice);
        vec3.copy(this.up, up);
    }

    updateFront(){
        const normal = vec4.create();
        vec4.set(normal, 0, 0, 1, 0);
        vec4.transformMat4(normal, normal, this.matrice);
        vec3.copy(this.front, normal);
    }

    setPosition(position){
        vec3.copy(this.position, position);
        this.update();
    }

    // Set camera elevation
    setPitch(pitch) {
        this.changePitch(pitch - this.pitch);
    }

    // Change camera elevation
    changePitch(pitch) {
        this.pitch += pitch;

        if (this.pitch > 360 || this.pitch < -360) {
        this.pitch = this.pitch % 360;
        }

        this.update();
    }

    // Set camera azimuth
    setRoll(roll) {
        this.changeRoll(roll - this.roll);
    }

    // Change camera azimuth
    changeRoll(roll) {
        this.roll += roll;

        if (this.roll > 360 || this.roll < -360) {
        this.roll = this.roll % 360;
        }

        this.update();
    }

    lookAt(focus){
        mat4.targetTo(this.matrice, this.position, focus, this.up);
        this.update();
    }

    goHome(home){
        if(home){
            this.home = home;
        }
        this.setPosition(this.home);
        this.setRoll(0);
        this.setPitch(0);
    }

    getViewTransform(){
        let model = mat4.create();
        mat4.invert(model, this.matrice);
        return model;
    }
}