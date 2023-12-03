export class Object3D{
    constructor(name = "default"){
        this.position = vec3.create();
        this.quat = quat.create();
        this.modelMatrix = mat4.create();
        this.scale = vec3.create();
        vec3.set(this.scale, 1, 1, 1);
        this.name = name;
        this.boundingBox = null;
        this.parent = null;
        this.children = [];
    }

    getScale(){
        return this.scale;
    }

    setScale(scale){
        vec3.set(this.scale, scale[0], scale[1], scale[2]);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }
    
    scaleX(x){
        vec3.set(this.scale, x, this.scale[1], this.scale[2]);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    scaleY(y){
        vec3.set(this.scale, this.scale[0], y, this.scale[2]);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    scaleZ(z){
        vec3.set(this.scale, this.scale[0], this.scale[1], z);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    setBoundingBox(boundingBox){
        this.boundingBox = boundingBox;
    }
    
    add(object, gl, program){
        object.init(gl, program)
        this.children.push(object);
        object.parent = this;
    }

    getPosition(){
        return this.position;
    }

    setPosition(position){
        vec3.copy(this.position, position);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    translateX(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0] + value,
            this.position[1],
            this.position[2]);
        vec3.copy(this.position, newPos);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    translateY(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0],
            this.position[1] + value,
            this.position[2]);
        vec3.copy(this.position, newPos);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    translateZ(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0],
            this.position[1],
            this.position[2] + value);
        vec3.copy(this.position, newPos);
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    getRotate(){
        return this.quat;
    }

    rotateX(deg){
        quat.rotateX(this.quat, this.quat, deg * (Math.PI / 180));
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    rotateY(deg){
        quat.rotateY(this.quat, this.quat, deg * (Math.PI / 180));
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    rotateZ(deg){
        quat.rotateZ(this.quat, this.quat, deg * (Math.PI / 180));
        this.boundingBox.updateBoundingBox(this.getWorldPosition(), this.getWorldRotation(), this.getWorldScale());
    }

    getModelMatrix(){
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, this.quat, this.position, this.scale);
        if(this.parent != null){
            mat4.multiply(modelMatrix, modelMatrix, this.parent.modelMatrix);
        }
        this.modelMatrix = modelMatrix;
        return modelMatrix;
    }

    getWorldPosition(){
        if(this.parent != null){
            const worldPos = vec3.create();
            const parentPos = this.parent.getWorldPosition();
            vec3.add(worldPos, this.position, parentPos);
            return worldPos;
        }
        return this.getPosition();
    }

    getWorldRotation(){
        if(this.parent != null){
            const worldRot = quat.create();
            const parentQuat = this.parent.getWorldRotation();
            quat.multiply(worldRot, this.quat, parentQuat);
            return worldRot;
        }
        return this.quat;
    }

    getWorldScale(){
        if(this.parent != null){
            const worldScale = vec3.create();
            const parentScale = this.parent.getWorldScale();
            vec3.multiply(worldScale, this.scale, parentScale);
            return worldScale;
        }
        return this.scale;
    }

    intersectObject(obj){
        return this.boundingBox.intersectBoundingBox(obj.boundingBox);
    }
}