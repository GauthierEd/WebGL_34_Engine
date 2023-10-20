import { Geometry } from "../Geometry/Geometry.js";
import { MeshComplex } from "../Core/MeshComplex.js";
import { PhongMaterial } from "../Material/PhongMaterial.js";
import { BoundingBox } from "../Core/BoundingBox.js";

export class LoadOBJ{
    constructor(path){
        this.path = path;
        this.pathMat;
        this.materials = {};

        this.vertexBuffer = {};
        this.textureBuffer = {};
        this.normalBuffer = {};
        this.indexBuffer = {};

        this.axisX = {
            "min": null,
            "max": null
        };
        this.axisY = {
            "min": null,
            "max": null
        };
        this.axisZ = {
            "min": null,
            "max": null
        };
    }

    createGeometry(){
        return fetch(this.path)
            .then(res => res.text())
            .then(data => {
                this.parseFile(data.split("\n"));
                let geometrie = new Geometry();
                let {vertices, indices, normals} = this.createBuffer();
                geometrie.setVertex(vertices);
                geometrie.setIndex(indices);
                geometrie.setNormal(normals);
                return geometrie;
            })
            .catch(console.error)
    }

    createMesh(name){
        let boundingBox = new BoundingBox(this.axisX, this.axisY, this.axisZ);
        let mesh = new MeshComplex(name);
        mesh.setBoundingBox(boundingBox);
        for (const [key, value] of Object.entries(this.vertexBuffer)) {
            for (const [materialName, vertices] of Object.entries(value)) {
                let geometrie = new Geometry();
                geometrie.setVertex(vertices);
                geometrie.setIndex(this.indexBuffer[key][materialName]);
                geometrie.setNormal(this.normalBuffer[key][materialName]);
                geometrie.setTexture(this.textureBuffer[key][materialName]);
                let materialValue = this.materials[materialName];
                let material = new PhongMaterial();
                if(materialValue.Kd){
                    material.setDiffuse(materialValue.Kd);
                }
                if(materialValue.map_Kd){
                    material.setTexture(materialValue.map_Kd);
                }
                material.setAmbient(materialValue.Ka);
                material.setSpecular(materialValue.Ks);
                material.setSpecularExponent(materialValue.Ns);
                material.setTransparency(materialValue.d);
                material.setIllum(materialValue.illum);
                mesh.addGeometrie(geometrie);
                mesh.addMaterial(material);
            }
        }
        return mesh;
    }

    async load(name){
        await this.createBuffer();
        await this.parseMaterialFile();
        return this.createMesh(name);
    }

    createBuffer(){
        return fetch(this.path)
        .then(res => res.text())
        .then(data => {
            let vertex = [];
            let texture = [];
            let normal = [];
            let index = 0;
            let hasIndex = {};
            let file = data.split("\n");
            let nameObject;
            let nameMaterial;
            file.forEach(async (line) => {
                // Récupération du fichier avec les materiaux
                if(line.includes("mtllib")){
                    let fileName = line.split(" ")[1];
                    let path = this.path.split("/");
                    path.pop();
                    this.pathMat = path.join("/") + "/" + fileName;
                }else if(line.includes("o ")){
                    nameObject = line.split(" ")[1];
                    this.vertexBuffer[nameObject] = {};
                    this.normalBuffer[nameObject] = {};
                    this.textureBuffer[nameObject] = {};
                    this.indexBuffer[nameObject] = {};
                    index = 0;
                    hasIndex = {};
                }else if(line.includes("v ")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    vertex.push(value);
                    let x = value[0];
                    let y = value[1];
                    let z = value[2];

                    // Initialise les max et min de chaque axe au début
                    if(this.axisX["max"] == null && this.axisX["min"] == null){
                        this.axisX["max"] = x;
                        this.axisX["min"] = x;
                    }
                    if(this.axisY["max"] == null && this.axisY["min"] == null){
                        this.axisY["max"] = y;
                        this.axisY["min"] = y;
                    }
                    if(this.axisZ["max"] == null && this.axisZ["min"] == null){
                        this.axisZ["max"] = z;
                        this.axisZ["min"] = z;
                    }
                    // test pour trouver les max et min de chaque axe
                    if(x > this.axisX["max"]){
                        this.axisX["max"] = x;
                    }else if(x < this.axisX["min"]){
                        this.axisX["min"] = x;
                    }
                    if(y > this.axisY["max"]){
                        this.axisY["max"] = y;
                    }else if(y < this.axisY["min"]){
                        this.axisY["min"] = y;
                    }
                    if(z > this.axisZ["max"]){
                        this.axisZ["max"] = z;
                    }else if(z < this.axisZ["min"]){
                        this.axisZ["min"] = z;
                    }
                }else if(line.includes("vt ")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    texture.push(value);
                }else if(line.includes("vn ")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    normal.push(value);
                }else if(line.includes("usemtl ")){
                    nameMaterial = line.split(" ")[1];
                    this.vertexBuffer[nameObject][nameMaterial] = [];
                    this.normalBuffer[nameObject][nameMaterial] = [];
                    this.indexBuffer[nameObject][nameMaterial] = [];
                    this.textureBuffer[nameObject][nameMaterial] = [];
                    hasIndex = {};
                    index = 0;
                }else if(line.includes("f ")){
                    let triangle = line.split(" ");
                    triangle.shift();
                    triangle.forEach(point => {
                        if(!hasIndex[point]){
                            let pointSplit = point.split("/");
                            
                            let normalIndex = parseFloat(pointSplit[pointSplit.length - 1]) - 1;
                            let textureIndex = parseFloat(pointSplit[1]) - 1;
                            let vertexIndex = parseFloat(pointSplit[0]) - 1;
                            this.vertexBuffer[nameObject][nameMaterial].push(...vertex[vertexIndex]);
                            this.textureBuffer[nameObject][nameMaterial].push(...texture[textureIndex]);
                            hasIndex[point] = index;
                            this.indexBuffer[nameObject][nameMaterial].push(index);
                            index += 1;
                            this.normalBuffer[nameObject][nameMaterial].push(...normal[normalIndex]);
                        }else{
                            this.indexBuffer[nameObject][nameMaterial].push(hasIndex[point]);
                        }
                    });
                }
            });
        });
    }

    parseMaterialFile(){
        return fetch(this.pathMat)
        .then(res => res.text())
        .then(data => {
            let file = data.split("\n");
            let materialName;
            file.forEach(line => {
                // Création d'un nouveau material
                if(line.includes("newmtl")){
                    materialName = line.split(" ")[1];
                    this.materials[materialName] = {};
                }else if(line.includes("Ns")){
                    let value = line.split(" ")[1];
                    this.materials[materialName]["Ns"] = parseFloat(value);
                }else if(line.includes("Ka")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    this.materials[materialName]["Ka"] = value;
                }else if(line.startsWith("Kd")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    this.materials[materialName]["Kd"] = value;
                }else if(line.includes("Ks")){
                    let value = line.split(" ").map(Number);
                    value.shift();
                    this.materials[materialName]["Ks"] = value;
                }else if(line[0] === "d"){
                    let value = line.split(" ")[1];
                    this.materials[materialName]["d"] = parseFloat(value);
                }else if(line.includes("illum")){
                    let value = line.split(" ")[1];
                    this.materials[materialName]["illum"] = parseFloat(value);
                }else if(line.includes("map_Kd")){
                    let value = line.split(" ");
                    this.materials[materialName]["map_Kd"] = value[1];
                }
            });
        });
    }
}