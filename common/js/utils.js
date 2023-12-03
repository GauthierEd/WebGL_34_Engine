'use strict';

const utils = {
    getCanvas(id){
        const canvas = document.querySelector(id);
        if(!canvas){
            console.error("No canvas");
            return null;
        }

        return canvas;
    },

    getGLContext(canvas){
        return canvas.getContext('webgl2') || console.error("Webgl2 not available");
    },
    
    getShader(gl, id){

      const script = document.querySelector(id);
      if(!script){
        return null;
      }
      const shaderString = script.text.trim();
      let shader;
      if(script.type === "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
      }else if(script.type === "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      }else{
          return null;
      }
      gl.shaderSource(shader, shaderString);
      gl.compileShader(shader);

      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
  },
  
  autoResizeCanvas(canvas){
    const expandFullScreen = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    expandFullScreen();
    window.addEventListener('resize', expandFullScreen);
  },
    configureControls(settings, options = { width: 300 }) {
        // Check if a gui instance is passed in or create one by default
        const gui = options.gui || new dat.GUI(options);
        const state = {};
    
        const isAction = v => typeof v === 'function';
    
        const isFolder = v =>
          !isAction(v) &&
          typeof v === 'object' &&
          (v.value === null || v.value === undefined);
    
        const isColor = v =>
          (typeof v === 'string' && ~v.indexOf('#')) ||
          (Array.isArray(v) && v.length >= 3);
    
        Object.keys(settings).forEach(key => {
          const settingValue = settings[key];
    
          if (isAction(settingValue)) {
            state[key] = settingValue;
            return gui.add(state, key);
          }
          if (isFolder(settingValue)) {
            // If it's a folder, recursively call with folder as root settings element
            return utils.configureControls(settingValue, { gui: gui.addFolder(key) });
          }
    
          const {
            value,
            min,
            max,
            step,
            options,
            onChange = () => null,
          } = settingValue;
    
          // set state
          state[key] = value;
    
          let controller;
    
          // There are many other values we can set on top of the dat.GUI
          // API, but we'll only need a few for our purposes
          if (options) {
            controller = gui.add(state, key, options);
          }
          else if (isColor(value)) {
            controller = gui.addColor(state, key)
          }
          else {
            controller = gui.add(state, key, min, max, step)
          }
    
          controller.onChange(v => onChange(v, state))
        });
      },
    
    calculateNormals(vertices, indices){
      const normals = [];
      for(let i = 0; i < vertices.length; i += 3){
        normals[i] = 0.0;
        normals[i + 1] = 0.0;
        normals[i + 2] = 0.0;
      }

      for(let i = 0; i < indices.length; i += 3){
        let p1 = [];
        let p2 = [];
        let normal = [];
        
        // p2 - p1
        p1[0] = vertices[3 * indices[i + 2]] - vertices[3 * indices[i + 1]];
        p1[1] = vertices[3 * indices[i + 2] + 1] - vertices[3 * indices[i + 1] + 1];
        p1[2] = vertices[3 * indices[i + 2] + 2] - vertices[3 * indices[i + 1] + 2];

        // p0 - p1
        p2[0] = vertices[3 * indices[i]] - vertices[3 * indices[i + 1]];
        p2[1] = vertices[3 * indices[i] + 1] - vertices[3 * indices[i + 1] + 1];
        p2[2] = vertices[3 * indices[i] + 2] - vertices[3 * indices[i + 1] + 2]

        // Calcule normal
        normal[0] = p1[1] * p2[2] - p1[2] * p2[1];
        normal[1] = p1[2] * p2[0] - p1[0] * p2[2];
        normal[2] = p1[0] * p2[1] - p1[1] * p2[0];

        // Sommes des normals pour les vertex partagés
        for(let j = 0; j < 3; j++){
          normals[3 * indices[i + j]] = normals[3 * indices[i + j]] +normal[0];
          normals[3 * indices[i + j] + 1] = normals[3 * indices[i + j] + 1] + normal[1];
          normals[3 * indices[i + j] + 2] = normals[3 * indices[i + j] + 2] + normal[2] ;
        }
      }

      // Normalize normals
      for(let i = 0; i < vertices.length; i += 3){
        let x = normals[i];
        let y = normals[i + 1];
        let z = normals[i + 2];

        let len = Math.sqrt(x * x + y * y + z * z);
        if(len === 0) len = 1;
        x /= len;
        y /= len;
        z /= len;

        normals[i] = x;
        normals[i + 1] = y;
        normals[i + 2] = z;
      }

      return normals;
    },

    normalizeColor(color){
      return color.map(c => c / 255);
    },

    denormalizeColor(color){
      return color.map(c => c * 255);
    },

    createVerticesFromDict(dict){
      let vertices = [];
      // Front
      vertices.push(...dict["x3"], ...dict["x4"], ...dict["x2"], ...dict["x1"]);
      // Back
      vertices.push(...dict["x7"], ...dict["x5"], ...dict["x6"], ...dict["x8"]);
      // Top
      vertices.push(...dict["x5"], ...dict["x1"], ...dict["x2"], ...dict["x6"]);
      // Bottom
      vertices.push(...dict["x7"], ...dict["x8"], ...dict["x4"], ...dict["x3"]);
      // Right
      vertices.push(...dict["x8"], ...dict["x6"], ...dict["x2"], ...dict["x4"]);
      // Left
      vertices.push(...dict["x7"], ...dict["x3"], ...dict["x1"], ...dict["x5"]);
      return vertices;
    },

    createIndexForBox(){
      let index = [];
      let i = 0;
      // Front
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      i += 4;
      // Back
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      i += 4;
      // Top
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      i += 4;
      // Bottom
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      i += 4;
      // Right
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      i += 4;
      // Left
      index.push(i, i+1, i+2);
      index.push(i, i+2, i+3);
      return index;
    },
    
};