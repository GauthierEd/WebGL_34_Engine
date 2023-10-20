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
        // Face avant
        this.x1 = [ this.axisX["min"],
                    this.axisY["max"],
                    this.axisZ["min"]
                    ];
        this.x2 = [ this.axisX["max"],
                    this.axisY["max"],
                    this.axisZ["min"]
                    ];
        this.x3 = [ this.axisX["min"],
                    this.axisY["min"],
                    this.axisZ["min"]
                    ];
        this.x4 = [ this.axisX["max"],
                    this.axisY["min"],
                    this.axisZ["min"]
                    ];

        // Face arrière
        this.x5 = [ this.axisX["min"],
                    this.axisY["max"],
                    this.axisZ["max"]
                    ];
        this.x6 = [ this.axisX["max"],
                    this.axisY["max"],
                    this.axisZ["max"]
                    ];
        this.x7 = [ this.axisX["min"],
                    this.axisY["min"],         
                    this.axisZ["max"]
                    ];
        this.x8 = [ this.axisX["max"],
                    this.axisY["min"],
                    this.axisZ["max"]
                    ];
    }
}