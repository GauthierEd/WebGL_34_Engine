export class Program {
    constructor(gl, vertexShaderId, fragmentShaderId){
        this.gl = gl;
        this.program = gl.createProgram();

        if(!(vertexShaderId && fragmentShaderId)){
            return console.error('No shaders ID');
        }

        gl.attachShader(this.program, utils.getShader(gl, vertexShaderId));
        gl.attachShader(this.program, utils.getShader(gl, fragmentShaderId));
        gl.linkProgram(this.program);

        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            console.error("Could not initialize shaders");
            return null;
        }

        this.useProgram();
    }

    useProgram(){
        this.gl.useProgram(this.program);
    }

    load(attributes, uniforms){
        this.useProgram();
        this.setAttributeLocations(attributes);
        this.setUniformLocations(uniforms);
    }

    setAttributeLocations(attributes){
        attributes.forEach(attribute => {
            this[attribute] = this.gl.getAttribLocation(this.program, attribute);
        });
    }

    setUniformLocations(uniforms){
        uniforms.forEach(uniform => {
            this[uniform] = this.gl.getUniformLocation(this.program, uniform);
        })
    }

    getUniform(uniformLocation){
        return this.gl.getUniform(this.program, uniformLocation);
    }
}