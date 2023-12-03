export class Controls{
    constructor(canvas, camera){
        this.canvas = canvas;
        this.camera = camera;
        this.hasDebug = false;
        this.hasClicked = false;
        this.motionFactor = 10;
        this.oldX = 0;
        this.oldY = 0;
        this.x = 0;
        this.y = 0;

        canvas.onmousedown = event => this.onMouseDown(event);
        canvas.onmouseup = event => this.onMouseUp(event);
        canvas.onmousemove = event => this.onMouseMove(event);
        document.onwheel = event => this.onWheel(event);
        document.onkeydown = event => this.onKeyDown(event);
    }

    onKeyDown(ev){
        if(ev.code == 'KeyD'){
            this.hasDebug = !this.hasDebug;
        }
    }

    onWheel(ev){
        const { wheelDelta } = ev;
        if(wheelDelta > 0){
            this.camera.zoom(1)
        }else{
            this.camera.zoom(-1)
        }
    }

    onMouseDown(ev){
        this.hasClicked = true;
        this.x = ev.clientX;
        this.y = ev.clientY;
    }

    onMouseUp(ev){
        this.hasClicked = false;
    }

    onMouseMove(ev){
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = ev.clientX;
        this.y = ev.clientY;

        if(this.hasClicked){
            const dx = this.x - this.oldX;
            const dy = this.y - this.oldY;
            const { width, height } = this.canvas;
            const deltaRoll = -20 / width;
            const deltaPitch = -20 / height;

            const roll = dx * deltaRoll * this.motionFactor;
            const pitch = dy * deltaPitch * this.motionFactor;
            this.camera.changeRoll(roll);
            this.camera.changePitch(pitch);
        }
    }
}