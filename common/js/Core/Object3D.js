export class Object3D{
    constructor(name = "default"){
        this.position = vec3.create();
        this.quat = quat.create();
        this.modelMatrix = mat4.create();
        this.scale = vec3.create();
        this.name = name;
        this.boundingBox = null;
        this.parent = null;
        this.children = [];
    }

    setScale(scale){
        vec3.set(this.scale, scale[0], scale[1], scale[2]);
    }
    
    setScaleX(x){
        vec3.set(this.scale, x, this.scale[1], this.scale[2]);
    }

    setScaleY(y){
        vec3.set(this.scale, this.scale[0], y, this.scale[2]);
    }

    setScaleZ(z){
        vec3.set(this.scale, this.scale[0], this.scale[1], z);
    }

    setBoundingBox(boundingBox){
        this.boundingBox = boundingBox;
    }
    
    add(object, gl, program){
        object.init(gl, program)
        this.children.push(object);
        object.parent = this;
    }

    setPosition(position){
        vec3.copy(this.position, position);
    }

    translateX(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0] + value,
            this.position[1],
            this.position[2]);
        vec3.copy(this.position, newPos);
    }

    translateY(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0],
            this.position[1] + value,
            this.position[2]);
        vec3.copy(this.position, newPos);
    }

    translateZ(value){
        const newPos = vec3.create();
        vec3.set(newPos, 
            this.position[0],
            this.position[1],
            this.position[2] + value);
        vec3.copy(this.position, newPos);
    }

    rotateX(deg){
        quat.rotateX(this.quat, this.quat, deg * (Math.PI / 180));
    }

    rotateY(deg){
        quat.rotateY(this.quat, this.quat, deg * (Math.PI / 180));
    }

    rotateZ(deg){
        quat.rotateZ(this.quat, this.quat, deg * (Math.PI / 180));
    }

    getModelMatrix(){
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslation(modelMatrix, this.quat, this.position);
        if(parent != null){
            mat4.multiply(modelMatrix, modelMatrix, this.parent.modelMatrix);
        }
        this.modelMatrix = modelMatrix;
        return modelMatrix;
    }
}