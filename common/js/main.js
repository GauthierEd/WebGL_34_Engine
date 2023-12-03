import { Renderer } from "./Core/Renderer.js";
import { Axis } from "./Geometry/Axis.js";
import { BoxGeometrie } from './Geometry/BoxGeometrie.js';
import { Mesh } from './Core/Mesh.js';
import { PhongMaterial } from "./Material/PhongMaterial.js";

let renderer = new Renderer("#webgl-canvas");



let geometrie = new BoxGeometrie();
let material = new PhongMaterial([1, 1, 1], "common/img/webgl.png");
material.setAmbient([1, 1, 1]);
//material.setDiffuse([0.02013,0.05858,0.45752]);
material.setIllum(2);
material.setSpecular([0.16667,0.16667,0.16667]);
material.setSpecularExponent(292.15686);
let mesh = new Mesh(geometrie, material, "cube1");
renderer.add(mesh, renderer.gl, renderer.program);

/*
geometrie = new BoxGeometrie();
material = new PhongMaterial([1, 1, 1]);
material.setAmbient([1, 1, 1]);
material.setDiffuse([0.02013,0.05858,0.45752]);
material.setIllum(2)
material.setSpecular([0.16667,0.16667,0.16667]);
material.setSpecularExponent(292.15686);
let mesh2 = new Mesh(geometrie, material, "cube2");
renderer.add(mesh2, renderer.gl, renderer.program);
mesh2.translateX(2.45);
*/

/*let axis = new Axis(200);
let mat = new PhongMaterial([1, 1, 1]);
mat.setAmbient([1, 1, 1]);
mat.setDiffuse([0.02013,0.05858,0.45752]);
mat.setIllum(2)
mat.setSpecular([0.16667,0.16667,0.16667]);
mat.setSpecularExponent(292.15686);
renderer.addObject(new Mesh(axis, mat, "axis"));*/

/*
let path = "common/models/car/car.obj";
let loader = new LoadOBJ(path);
let m = await loader.load('car');
renderer.add(m, renderer.gl, renderer.program);
*/
renderer.render();