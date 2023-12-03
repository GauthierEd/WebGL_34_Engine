export class BoundingBox {
    constructor(axisX, axisY, axisZ){
        this.axisX = axisX;
        this.axisY = axisY;
        this.axisZ = axisZ;
        /* 
                    x5  -------------- x6
                    -  |            - |
                -      |         -    |
            -          |      -       |
        x1  ---------------- x2       | 
            |          |   |          |
            |      x7  ----|---------- x8
            |       -      |       -  
            |     -        |     -
            |  -           |  -
        x3  ---------------- x4
        
        */
        this.coords = {
            // Face avant
            "x1": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["max"]),
            "x2": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["max"]),
            "x3": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["max"]),
            "x4": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["max"]),
            // Face arrière
            "x5": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["min"]),
            "x6": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["min"]),
            "x7": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["min"]),
            "x8": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["min"]),
        };
        this.initCoords = {
            // Face avant
            "x1": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["max"]),
            "x2": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["max"]),
            "x3": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["max"]),
            "x4": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["max"]),
            // Face arrière
            "x5": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["min"]),
            "x6": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["min"]),
            "x7": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["min"]),
            "x8": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["min"]),
        };
        this.position = vec3.create();
        this.rotation = quat.create();
        this.scale = vec3.create();
        // Buffer
        this.vao = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null;
        this.material = {"wireframe": true};
    }

    init(gl, program){
        this.gl = gl;
        this.program = program;
        let vertices = utils.createVerticesFromDict(this.coords);
        let index = utils.createIndexForBox();
        let normals = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
        ];
        this.geometrie = {
            "vertices": vertices,
            "normals": normals,
            "indices": index
        };
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

        // CLEAN
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null),
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    updateVertexBuffer(coords){
        this.geometrie.vertices = utils.createVerticesFromDict(coords);
        // VAO
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        // NORMAL
        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometrie.normals), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.program.aVertexNormal);
        this.gl.vertexAttribPointer(this.program.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
        // INDEX
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometrie.indices), this.gl.STATIC_DRAW);
        // VERTEX
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.geometrie.vertices), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.program.aVertexPosition);
        this.gl.vertexAttribPointer(this.program.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
        // CLEAN
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null),
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    updateBoundingBox(worldPos, worldQuat, worldScale){
        vec3.copy(this.position, worldPos);
        quat.copy(this.rotation, worldQuat);
        vec3.copy(this.scale, worldScale);
        this.updateVertex();
    }

    updateVertex(){
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.position, this.scale);
        for(const [key, value] of Object.entries(this.initCoords)){
            let temp = vec4.create();
            vec3.set(temp, value[0], value[1], value[2]);
            vec3.transformMat4(temp, temp, modelMatrix);
            let vector = vec3.create();
            vec3.set(vector, temp[0], temp[1], temp[2]);
            this.coords[key] = vector;
        }
        this.updateVertexBuffer(this.coords);
    }
}