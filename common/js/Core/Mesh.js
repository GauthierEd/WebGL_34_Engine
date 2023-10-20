import { Object3D } from "./Object3D.js";

export class Mesh extends Object3D{
    constructor(geometrie, material, name = "default"){
        super(name);
        this.geometrie = geometrie;
        this.material = material;
        this.hasTexture = false;
        // Buffer
        this.vao = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.textureBuffer = null;
        this.textureImg = null;
    }

    init(gl, program){
        // VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        // VERTEX
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        // NORMAL
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aVertexNormal);
        gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
        // INDEX
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometrie.indices), gl.STATIC_DRAW);

        if(this.material.texturePath){
            this.textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometrie.textures), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.aVertexTextureCoords);
            gl.vertexAttribPointer(program.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
            this.hasTexture = true;
            this.textureImg = gl.createTexture();
            const image = new Image();
            image.src = this.material.texturePath;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.textureImg);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        }


        // CLEAN
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null),
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}