import { Object3D } from "./Object3D.js";

export class MeshComplex extends Object3D{
    constructor(name = "default"){
        super(name);
        this.geometrie = [];
        this.material = [];
        this.hasTexture = [];
        // Buffer
        this.vao = [];
        this.vertexBuffer = [];
        this.indexBuffer = [];
        this.normalBuffer = [];
        this.textureBuffer = [];
        this.textureImg = [];
    }

    addGeometrie(geometrie){
        this.geometrie.push(geometrie);
    }

    addMaterial(material){
        this.material.push(material);
    }

    init(gl, program){
        for(let i = 0; i < this.geometrie.length; i++){
            // VAO
            let vaoB = gl.createVertexArray();
            gl.bindVertexArray(vaoB);
            // VERTEX
            let vertex = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie[i].vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexPosition);
            gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            // NORMAL
            let normal = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normal);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie[i].normals), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexNormal);
            gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
            // INDEX
            let index = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometrie[i].indices), gl.STATIC_DRAW);
            
            
            if(this.material[i].texturePath){
                let textureB = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, textureB);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie[i].textures), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(program.aVertexTextureCoords);
                gl.vertexAttribPointer(program.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
                this.textureBuffer.push(textureB);
                this.hasTexture.push(true);
                let texture = gl.createTexture();
                const image = new Image();
                image.src = this.material[i].texturePath;
                image.onload = () => {
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                this.textureImg.push(texture);
            }else{
                this.hasTexture.push(false);
            }
            
            // CLEAN
            this.vertexBuffer.push(vertex);
            this.indexBuffer.push(index);
            this.normalBuffer.push(normal);
            this.vao.push(vaoB);
            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null),
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
}