import { Program } from './Program.js';
import { Scene } from './Scene.js';
import { OrbitingCamera } from '../Camera/OrbitingCamera.js';
import { Controls } from './Controls.js';
import { LightManager } from '../Lights/LightManager.js';
import { SpotLight } from '../Lights/SpotLight.js';
import { PositionalLight } from '../Lights/PositionalLight.js';
import { Mesh } from './Mesh.js';
import { MeshComplex } from './MeshComplex.js';

export class Renderer{
    constructor(canvasID){
        this.canvas = utils.getCanvas(canvasID);
        this.gl = utils.getGLContext(this.canvas);
        this.program = new Program(this.gl, "#vertex-shader", "#fragment-shader");
        this.scene = new Scene(this.gl, this.program);
        this.camera = new OrbitingCamera(45, 1, 5000);
        this.camera.goHome([0, 0 , 10]);
        this.camera.lookAt([0, 0, 0]);
        this.controls = new Controls(this.canvas, this.camera);
        this.lights = new LightManager();

        this.modelViewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.stack = [];
        
        this.init();
    }

    init(){
        utils.autoResizeCanvas(this.canvas);
        this.gl.clearColor(0.9, 0.9, 0.9, 1);
        this.gl.clearDepth(1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(this.gl.FUNC_ADD);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

        const attributes = [
            'aVertexPosition',
            'aVertexNormal',
            'aVertexColor',
            'aVertexTextureCoords'
        ];
        const uniforms = [
            'uProjectionMatrix',
            'uModelViewMatrix',
            'uNormalMatrix',
            'uLightPosition',
            'uWireframe',
            'uLd',
            'uLs',
            'uKa',
            'uKd',
            'uKs',
            'uNs',
            'uD',
            'uIllum',
            'uSampler',
            'uTexture'
        ];
        this.program.load(attributes, uniforms);
        let positions = [[-1000, 1000, -1000], [1000, 1000, -1000], [-1000, 1000, 1000],[1000, 1000, 1000]];
        for(let i = 0; i < 4; i++){
            const light = new PositionalLight();
            light.setDiffuse([0.4, 0.4, 0.4]);
            light.setSpecular([0.8, 0.8, 0.8]);
            light.setAmbient([0.1, 0.1, 0.1]);
            light.setPosition(positions[i]);
            this.lights.add(light);
        }
       
        this.gl.uniform3fv(this.program.uLightPosition, this.lights.getArray('position'));
        this.gl.uniform3fv(this.program.uLd, this.lights.getArray('diffuse'));
        this.gl.uniform3fv(this.program.uLs, this.lights.getArray('specular'));
        
        this.initTransform();
    }

    add(mesh, gl, program){
        this.scene.add(mesh, gl, program);
    }

    initTransform(){
        this.modelViewMatrix = this.camera.getViewTransform();
        mat4.identity(this.projectionMatrix);
        this.updatePerspective();
        mat4.identity(this.normalMatrix);
        mat4.copy(this.normalMatrix, this.modelViewMatrix);
        mat4.invert(this.normalMatrix, this.normalMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
    }

    push(){
        const matrix = mat4.create();
        mat4.copy(matrix, this.modelViewMatrix);
        this.stack.push(matrix);
    }

    pop(){
        this.modelViewMatrix = this.stack.pop();
    }

    updatePerspective(){
        mat4.perspective(this.projectionMatrix, this.camera.fov * (Math.PI / 180), this.gl.canvas.width / this.gl.canvas.height, this.camera.minZ, this.camera.maxZ);
    }

    calculateModelView(){
        this.modelViewMatrix = this.camera.getViewTransform();
    }

    calculateNormal(modelMatrix){
        const normalMatrix = mat4.create();
        mat4.copy(normalMatrix, modelMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        this.normalMatrix = normalMatrix;
    }

    setMatriceUniforms(){
        this.gl.uniformMatrix4fv(this.program.uModelViewMatrix, false, this.modelViewMatrix);
        this.gl.uniformMatrix4fv(this.program.uProjectionMatrix, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.program.uNormalMatrix, false, this.normalMatrix);
    }

    drawObjects(root){
        root.children.forEach(object => {
            this.calculateModelView();
            this.push();
            const modelMatrix = object.getModelMatrix();
            mat4.multiply(this.modelViewMatrix, this.modelViewMatrix, modelMatrix);
            this.calculateNormal(modelMatrix);
            this.setMatriceUniforms();
            this.pop();

            if(object instanceof Mesh){
                // Material
                this.gl.uniform3fv(this.program.uKa, object.material.Ka);
                this.gl.uniform3fv(this.program.uKd, object.material.Kd);
                this.gl.uniform3fv(this.program.uKs, object.material.Ks);
                this.gl.uniform1f(this.program.uNs, object.material.Ns);
                this.gl.uniform1f(this.program.uD, object.material.D);
                this.gl.uniform1i(this.program.uIllum, object.material.illum);
                
                
                // Geometry
                this.gl.bindVertexArray(object.vao);
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);

                if(object.hasTexture){
                    this.gl.uniform1f(this.program.uTexture, true);
                    this.gl.activeTexture(this.gl.TEXTURE0);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, object.textureImg);
                    this.gl.uniform1i(this.program.uSampler, 0);
                }else{
                    this.gl.uniform1f(this.program.uTexture, false);
                }

                // Draw
                if(object.material.wireframe){
                    this.gl.drawElements(this.gl.LINES, object.geometrie.indices.length, this.gl.UNSIGNED_SHORT, 0);
                }else{
                    this.gl.enable(this.gl.CULL_FACE);
                    this.gl.cullFace(this.gl.FRONT);
                    this.gl.drawElements(this.gl.TRIANGLES, object.geometrie.indices.length, this.gl.UNSIGNED_SHORT, 0);
                    this.gl.cullFace(this.gl.BACK);
                    this.gl.drawElements(this.gl.TRIANGLES, object.geometrie.indices.length, this.gl.UNSIGNED_SHORT, 0);
                    this.gl.disable(this.gl.CULL_FACE);
                }
            }else if(object instanceof MeshComplex){
                let indexTexture = 0;
                for(let i = 0; i < object.geometrie.length; i++){
                    // Material
                    //console.log(object.material[i])
                    this.gl.uniform3fv(this.program.uKa, object.material[i].Ka);
                    this.gl.uniform3fv(this.program.uKd, object.material[i].Kd);
                    this.gl.uniform3fv(this.program.uKs, object.material[i].Ks);
                    this.gl.uniform1f(this.program.uNs, object.material[i].Ns);
                    this.gl.uniform1f(this.program.uD, object.material[i].D);
                    this.gl.uniform1i(this.program.uIllum, object.material[i].illum);
                    
                    // Geometry
                    this.gl.bindVertexArray(object.vao[i]);
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer[i]);

                    if(object.hasTexture[i]){
                        this.gl.uniform1i(this.program.uTexture, true);
                        this.gl.activeTexture(this.gl.TEXTURE0);
                        this.gl.bindTexture(this.gl.TEXTURE_2D, object.textureImg[indexTexture]);
                        indexTexture++;
                        this.gl.uniform1i(this.program.uSampler, 0);
                    }else{
                        this.gl.uniform1i(this.program.uTexture, false);
                    }

                    // Draw
                    if(object.material[i].wireframe){
                        this.gl.drawElements(this.gl.LINES, object.geometrie[i].indices.length, this.gl.UNSIGNED_SHORT, 0);
                    }else{
                        this.gl.enable(this.gl.CULL_FACE);
                        this.gl.cullFace(this.gl.FRONT);
                        this.gl.drawElements(this.gl.TRIANGLES, object.geometrie[i].indices.length, this.gl.UNSIGNED_SHORT, 0);
                        this.gl.cullFace(this.gl.BACK);
                        this.gl.drawElements(this.gl.TRIANGLES, object.geometrie[i].indices.length, this.gl.UNSIGNED_SHORT, 0);
                        this.gl.disable(this.gl.CULL_FACE);
                    }
                }
            }
            
            
            // Clean
            this.gl.bindVertexArray(null);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

            if(object.children.length != 0){
                this.drawObjects(object);
            }
        });
    }

    draw(){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.updatePerspective();
        this.gl.uniform1i(this.program.uUpdateLight, false);
        this.drawObjects(this.scene);
    }


    // Update object positions
    animate() {
        let cube = this.scene.objects[0];
        cube.translateX(this.dxCone);
        cube.rotateY(this.rotateX);
        if(cube.position[0] >= 10 || cube.position[0] <= -10){
            this.dxCone = -this.dxCone;
        }
    }
  
    render() {
        requestAnimationFrame(() => {this.render()});
        //this.animate();
        this.draw();
    }
}