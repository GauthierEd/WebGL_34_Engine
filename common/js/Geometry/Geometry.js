export class Geometry{
    constructor(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.textures = [];
        this.axisX = {};
        this.axisY = {};
        this.axisZ = {};
    }

    setTexture(texture){
        this.textures = texture;
    }

    setVertex(vertex){
        this.vertices = vertex;
    }

    setIndex(index){
        this.indices = index;
    }

    setNormal(normal){
        this.normals = normal;
    }
}