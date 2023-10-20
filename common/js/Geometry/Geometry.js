export class Geometry{
    constructor(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.textures = [];
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