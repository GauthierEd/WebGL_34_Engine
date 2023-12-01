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
            "x1": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["min"]),
            "x2": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["min"]),
            "x3": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["min"]),
            "x4": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["min"]),
            // Face arrière
            "x5": vec3.fromValues(this.axisX["min"], this.axisY["max"], this.axisZ["max"]),
            "x6": vec3.fromValues(this.axisX["max"], this.axisY["max"], this.axisZ["max"]),
            "x7": vec3.fromValues(this.axisX["min"], this.axisY["min"], this.axisZ["max"]),
            "x8": vec3.fromValues(this.axisX["max"], this.axisY["min"], this.axisZ["max"]),
        };
    }

    updateBoundingBox(pos){
        for(const [key, value] of Object.entries(this.coords)){
            vec3.add(value, value, pos);
        }
    }
}